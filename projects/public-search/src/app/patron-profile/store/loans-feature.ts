// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods, withComputed, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, type Error as ApiError, type EsResult } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { concatMap, finalize, from, map, Observable, of, tap, toArray } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanApiService } from '../../api/loan-api.service';

type LoansFeatureState = {
  loans: any[];
  loansLoaded: boolean;
  loansSortCriteria: string;
  renewingLoans: boolean;
};

export function withLoansFeature() {
  return signalStoreFeature(
    { state: type<{ patronPid: string | null }>() },
    withState<LoansFeatureState>({
      loans: [],
      loansLoaded: false,
      loansSortCriteria: 'duedate',
      renewingLoans: false,
    }),
    withComputed((state) => ({
      renewableLoans: computed(() => state.loans().filter((loan) => loan.canExtend?.can)),
    })),
    withMethods((
      store,
      loanApiService = inject(LoanApiService),
      spinner = inject(NgxSpinnerService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService)
    ) => {
      const refreshCanExtend = (loanPid: string) => loanApiService.canExtend(loanPid).pipe(
        tap(canExtend => {
          patchState(store, {
            loans: store.loans().map(loan =>
              loan.metadata?.pid === loanPid ? { ...loan, canExtend } : loan
            ),
          });
        })
      );

      const renewLoan = (record: any, patronPid: string) => {
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

      const renewSingleLoan = (record: any, patronPid: string) => {
        patchState(store, { renewingLoans: true });
        return renewLoan(record, patronPid).pipe(
          finalize(() => patchState(store, { renewingLoans: false }))
        );
      };

      const loadLoans = (page: number, recordsPerPage: number): Observable<EsResult | ApiError | unknown[]> => {
        const patronPid = store.patronPid();
        if (!patronPid) return of([]);

        patchState(store, { loansLoaded: false });
        return loanApiService
          .getOnLoan(patronPid, page, recordsPerPage, undefined, store.loansSortCriteria())
          .pipe(
            tap(response => {
              if (!('hits' in response)) return;
              patchState(store, {
                loans: response.hits.hits.map(loan => {
                  const storedLoan = store.loans().find(
                    currentLoan => currentLoan.metadata?.pid === loan.metadata?.pid
                  );
                  return storedLoan?.renewed ? { ...loan, renewed: true } : loan;
                }),
                loansLoaded: true,
              });
            })
          );
      };

      const reloadLoans = () => {
        loadLoans(1, 9999).subscribe((response) => {
          if (!('hits' in response)) return;
          store.loans().forEach(loan => refreshCanExtend(loan.metadata.pid).subscribe());
        });
      };

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
        void spinner.show('renew-all-loans');
        return from(renewableLoans).pipe(
          concatMap(loan => renewLoan(loan, patronPid)),
          toArray(),
          finalize(() => {
            void spinner.hide('renew-all-loans');
            patchState(store, { renewingLoans: false });
          })
        );
      };

      return {
        changeLoansSortCriteria(sortCriteria: string): void {
          patchState(store, { loansSortCriteria: sortCriteria });
        },
        loadLoans,
        canExtendLoan(loanPid: string) {
          return refreshCanExtend(loanPid);
        },
        renewLoan(recordPid: string) {
          const patronPid = store.patronPid();
          const record = store.loans().find(loan => loan.metadata?.pid === recordPid);
          if (!patronPid || !record) return of(undefined);

          return renewSingleLoan(record, patronPid);
        },
        renewAllLoans(): void {
          renewLoans().subscribe({
            next: (renewedLoans) => {
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
            },
            error: () => {
              messageService.add({
                severity: 'error',
                summary: translateService.instant('Error'),
                detail: translateService.instant('Error during the renewal of the items.'),
                closable: true,
              });
              reloadLoans();
            },
            complete: reloadLoans,
          });
        },
      };
    })
  );
}
