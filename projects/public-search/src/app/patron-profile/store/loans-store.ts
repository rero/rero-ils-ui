/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { computed, inject, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Record } from '@rero/ng-core';
import { concatMap, forkJoin, from, map, of, pipe, switchMap, tap, toArray } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';

type LoansState = {
  loans: any[];
  loansLoading: boolean;
  renewInProgress: boolean;
  currentPatronPid: string;
};

const initialLoansState = {
  loans: [],
  loansLoading: false,
  renewInProgress: false,
  currentPatronPid: undefined,
};

export const LoansStore = signalStore(
  withState<LoansState>(initialLoansState),
  withComputed((state) => ({
    renewableLoans: computed(() => state.loans().filter((loan) => loan.canExtend?.can)),
  })),
  withProps(() => ({
    translateService: inject(TranslateService),
    messageService: inject(MessageService),
  })), withMethods((store, loanApi = inject(LoanApiService)) => {

    const updateLoan = (loan: any, renewData: any) => {
      ['end_date', 'extension_count', 'is_late', 'due_soon_date'].map(
        (field) => (loan.metadata[field] = renewData[field])
      );
      if ('overdue' in loan.metadata) {
        delete loan.metadata.overdue;
      }
      loan.actionSuccess = true;
    };

    const updateLoanPermissions = rxMethod<void>(
      pipe(
        switchMap(() => {
          const loanPids = store.loans().map((loan: any) => loan.metadata.pid);
          return forkJoin(loanPids.map((pid: string) => loanApi.canExtend(pid)));
        }),
        tap((canExtendResponses) => {
          patchState(store, {
            loans: store.loans().map((loan: any, i) => ({
              ...loan,
              canExtend: canExtendResponses[i],
            })),
          });
        })
      )
    );

    const loadLoans = rxMethod<string /*loanSortCriteria*/>(
      pipe(
        // debounceTime(500),
        tap(() => patchState(store, { loansLoading: true })),
        switchMap((loanSortCriteria: string) =>
          loanApi.getOnLoan(store.currentPatronPid(), 1, 9999, undefined, loanSortCriteria)
        ),
        map((response: Record) => {
          if (response.hits.total.value === 0) {
            return [];
          }
          return response.hits.hits;
        }),
        tap((loans: any[]) => patchState(store, { loans: loans })),
        tap(() => updateLoanPermissions()),
        tap(() => patchState(store, { loansLoading: false }))
      )
    );

    const renewLoan = rxMethod<any /*loan*/>(
      pipe(
        tap(() => patchState(store, { renewInProgress: true })),
        tap((loan) => console.log(loan)),
        switchMap((loan) =>
          loanApi.renew({
            pid: loan.metadata.pid,
            item_pid: loan.metadata.item.pid,
            transaction_location_pid: loan.metadata.item.location.pid,
            transaction_user_pid: store.currentPatronPid()
          })
        ),
        tap((extendLoan) => {
          const loans = store.loans();
          if (extendLoan !== undefined) {
            const currentLoan = loans.find((l: any) => l.metadata.pid === extendLoan.pid);
            updateLoan(currentLoan, extendLoan);
            patchState(store, { loans })
            updateLoanPermissions();
            store.messageService.add({
              severity: 'success',
              summary: store.translateService.instant('Success'),
              detail: store.translateService.instant('The item has been renewed.'),
              life: CONFIG.MESSAGE_LIFE
            });
          } else {
            store.messageService.add({
              severity: 'error',
              summary: store.translateService.instant('Error'),
              detail: store.translateService.instant('Error during the renewal of the item.'),
              closable: true
            });
          }
        }),
        tap(() => patchState(store, { renewInProgress: false }))
      )
    );
    const renewLoans = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { renewInProgress: true })),
        switchMap(() =>
          from(
            store.renewableLoans().map((loan: any) =>
              loanApi.renew({
                pid: loan.metadata.pid,
                item_pid: loan.metadata.item.pid,
                transaction_location_pid: loan.metadata.item.location.pid,
                transaction_user_pid: store.currentPatronPid(),
              })
            )
          ).pipe(
            concatMap((obs) => obs),
            toArray()
          )
        ),
        tap((newLoans: any[]) => {
          let reloadPermsission = false;
          const loans = store.loans();
          newLoans.map((loan) => {
            if (loan) {
              const currentLoan = loans.find((l: any) => l.metadata.pid === loan.pid);
              updateLoan(currentLoan, loan);
            } else {
              reloadPermsission = true;
            }
          });
          patchState(store, { loans });
          if (reloadPermsission) {
            updateLoanPermissions();
          }
        }),
        tap(() => patchState(store, { renewInProgress: false }))
      )
    );
    return {
      updateLoanPermissions,
      loadLoans,
      renewLoans,
      renewLoan,
    };
  }),
  withHooks((store, menuStore = inject(PatronProfileMenuStore)) => ({
    onInit: () => {
      const patron = menuStore.currentPatron();
      if (patron) {
        patchState(store, { currentPatronPid: patron.pid });
        // initial load with default sort criteria
        store.loadLoans('duedate');
      }
    },
    // React to any patron change after init
    __patronEffect: effect(() => {
      const p = menuStore.currentPatron();
      if (p) {
        patchState(store, { currentPatronPid: p.pid });
        store.loadLoans('duedate');
      }
    })
  }))
);
