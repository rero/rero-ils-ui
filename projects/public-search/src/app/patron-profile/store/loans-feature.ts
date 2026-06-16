// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject, type Signal } from '@angular/core';
import { patchState, signalStoreFeature, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { catchError, concatMap, exhaustMap, finalize, forkJoin, from, map, of, pipe, switchMap, tap, toArray } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import type { PatronLoan } from '../patron-profile-loans/types';

type LoansFeatureState = {
  loans: PatronLoan[];
  loansLoaded: boolean;
  loansSortCriteria: string;
  renewingLoans: boolean;
  renewingLoanPid: string | null;
};

type LoadLoansInput = {
  patronPid: string | null;
  sortCriteria: string;
};

const loansPerPage = 9999;

export function withLoansFeature<_>() {
  return signalStoreFeature(
    { props: type<{ patronPid: Signal<string | null> }>() },
    withState<LoansFeatureState>({
      loans: [],
      loansLoaded: false,
      loansSortCriteria: 'duedate',
      renewingLoans: false,
      renewingLoanPid: null,
    }),
    withComputed((state) => ({
      renewableLoans: computed(() => state.loans().filter((loan) => loan.canExtend?.can)),
    })),
    withMethods((
      store,
      loanApiService = inject(LoanApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService)
    ) => {
      /** Refresh the renewal permission of one loan after a renewal. */
      const refreshCanExtend = (loanPid: string) => loanApiService.canExtend(loanPid).pipe(
        tap(canExtend => {
          patchState(store, {
            loans: store.loans().map(loan =>
              loan.metadata?.pid === loanPid ? { ...loan, canExtend } : loan
            ),
          });
        })
      );

      /** Renew one loan and update it in the store without reloading the list. */
      const renewLoan = (record: PatronLoan, patronPid: string) => {
        const metadata = record?.metadata;
        return loanApiService.renew({
          pid: metadata?.pid,
          item_pid: metadata?.item.pid,
          transaction_location_pid: metadata?.item.location.pid,
          transaction_user_pid: patronPid
        }).pipe(
          concatMap((extendLoan: any) => {
            if (extendLoan === undefined || !metadata) return of(extendLoan);
            patchState(store, {
              loans: store.loans().map(loan => {
                if (loan.metadata?.pid !== metadata.pid) return loan;
                const updatedMetadata = {
                  ...loan.metadata,
                  end_date: extendLoan.end_date,
                  extension_count: extendLoan.extension_count,
                  is_late: extendLoan.is_late,
                  due_soon_date: extendLoan.due_soon_date,
                };
                if ('overdue' in updatedMetadata) {
                  delete updatedMetadata.overdue;
                }
                return { ...loan, metadata: updatedMetadata, renewed: true };
              }),
            });
            return refreshCanExtend(metadata.pid).pipe(map(() => extendLoan));
          })
        );
      };

      /** Manage the loading state used by an individual renewal button. */
      const renewSingleLoan = (record: PatronLoan, patronPid: string) => {
        patchState(store, {
          renewingLoans: true,
          renewingLoanPid: record.metadata.pid,
        });
        return renewLoan(record, patronPid).pipe(
          finalize(() => patchState(store, {
            renewingLoans: false,
            renewingLoanPid: null,
          }))
        );
      };

      /** Display the result of an individual renewal. */
      const notifyRenewLoan = (success: boolean) => {
        if (success) {
          messageService.add({
            severity: 'success',
            summary: translateService.instant('Success'),
            detail: translateService.instant('The item has been renewed.'),
            life: CONFIG.MESSAGE_LIFE,
          });
        } else {
          messageService.add({
            severity: 'error',
            summary: translateService.instant('Error'),
            detail: translateService.instant('Error during the renewal of the item.'),
            closable: true,
          });
        }
      };

      /**
       * Load all loans, then enrich each loan with its renewal permission.
       */
      const loadLoans$ = ({ patronPid, sortCriteria }: LoadLoansInput) => {
        if (!patronPid) return of([]);

        patchState(store, { loansLoaded: false });
        return loanApiService
          .getOnLoan(patronPid, 1, loansPerPage, undefined, sortCriteria)
          .pipe(
            switchMap(response => {
              if (!('hits' in response)) throw response;

              const loans = response.hits.hits.map(loan => {
                const storedLoan = store.loans().find(
                  currentLoan => currentLoan.metadata?.pid === loan.metadata?.pid
                );
                return storedLoan?.renewed ? { ...loan, renewed: true } : loan;
              });

              if (!loans.length) {
                patchState(store, { loans: [] });
                return of([]);
              }

              return forkJoin(
                loans.map(loan =>
                  loanApiService.canExtend(loan.metadata.pid).pipe(
                    map(canExtend => canExtend ? { ...loan, canExtend } : loan),
                    catchError(error => {
                      console.error(error);
                      return of(loan);
                    })
                  )
                )
              ).pipe(
                tap(loans => patchState(store, { loans }))
              );
            }),
            catchError(error => {
              console.error(error);
              return of([]);
            }),
            finalize(() => patchState(store, { loansLoaded: true }))
          );
      };

      /** Renew renewable loans sequentially to avoid concurrent renewals. */
      const renewLoans = () => {
        const patronPid = store.patronPid();
        if (!patronPid) return of([]);

        const renewableLoans = [...store.renewableLoans()].sort((firstLoan, secondLoan) =>
          firstLoan.metadata.end_date.localeCompare(secondLoan.metadata.end_date)
        );
        if (!renewableLoans.length) return of([]);

        patchState(store, {
          renewingLoans: true,
        });
        return from(renewableLoans).pipe(
          concatMap(loan => renewLoan(loan, patronPid).pipe(
            // Keep processing the remaining loans when one renewal fails.
            catchError(() => of(undefined))
          )),
          toArray(),
          finalize(() => {
            patchState(store, { renewingLoans: false });
          })
        );
      };

      return {
        resetLoans(): void {
          patchState(store, {
            loans: [],
            loansLoaded: false,
            renewingLoans: false,
            renewingLoanPid: null,
          });
        },
        changeLoansSortCriteria(sortCriteria: string): void {
          patchState(store, { loansSortCriteria: sortCriteria });
        },
        /**
         * Reload when either the patron or the selected sort criteria changes.
         */
        loadLoans: rxMethod<LoadLoansInput>(
          pipe(
            switchMap(input => loadLoans$(input))
          )
        ),
        renewLoan: rxMethod<string>(
          pipe(
            exhaustMap(recordPid => {
              const patronPid = store.patronPid();
              const record = store.loans().find(loan => loan.metadata?.pid === recordPid);
              if (!patronPid || !record) {
                notifyRenewLoan(false);
                return of(undefined);
              }

              return renewSingleLoan(record, patronPid).pipe(
                tap(extendLoan => notifyRenewLoan(extendLoan !== undefined)),
                catchError(() => {
                  notifyRenewLoan(false);
                  return of(undefined);
                })
              );
            })
          )
        ),
        renewAllLoans: rxMethod<void>(
          pipe(
            exhaustMap(() => renewLoans().pipe(
              tap(renewedLoans => {
                const renewedCount = renewedLoans.filter(renewedLoan => renewedLoan !== undefined).length;
                const failedCount = store.loans().length - renewedCount;
                const success = failedCount === 0;
                messageService.add({
                  severity: success ? 'success' : 'warn',
                  summary: translateService.instant(success ? 'Success' : 'Warning'),
                  detail: success
                    ? `${renewedCount} items were renewed.`
                    : `${renewedCount} items were renewed ; ${failedCount} items could not be renewed.`,
                  life: success ? CONFIG.MESSAGE_LIFE : undefined,
                  closable: !success,
                });
              }),
              catchError(() => {
                messageService.add({
                  severity: 'error',
                  summary: translateService.instant('Error'),
                  detail: translateService.instant('Error during the renewal of the items.'),
                  closable: true,
                });
                return of([]);
              }),
              switchMap(() => loadLoans$({
                patronPid: store.patronPid(),
                sortCriteria: store.loansSortCriteria(),
              }))
            ))
          )
        ),
      };
    }),
    withHooks({
      onInit(store) {
        store.loadLoans(computed(() => ({
          patronPid: store.patronPid(),
          sortCriteria: store.loansSortCriteria(),
        })));
      },
    })
  );
}
