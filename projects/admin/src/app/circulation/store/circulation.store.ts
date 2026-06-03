/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Loan, LoanOverduePreview, LoanState } from '@app/admin/classes/loans';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { PatronService } from '@app/admin/service/patron.service';
import { LoanFixedDateService } from '@app/admin/circulation/services/loan-fixed-date.service';
import { getSeverity } from '@app/admin/utils/utils';
import { PatronTransactionService } from '../services/patron-transaction.service';
import { computeTotalTransactionsAmount } from '../utils/transaction.utils';
import { User } from '@rero/shared';
import { EMPTY, forkJoin, pipe } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

export type ICirculationSetting = {
  key: string;
  label: string;
  value: unknown;
  extra?: { remember?: boolean; severity?: string };
};

export type CirculationStatistics = {
  feesEngaged: number;
  fees: number;
  overdueFees: number;
  pending: number;
  pickup: number;
  loan: number;
  ill: number;
};

export type CirculationMessage = {
  severity: string;
  detail: string;
};

export type CirculationState = {
  patron: User | undefined;
  statistics: CirculationStatistics;
  messages: CirculationMessage[];
  overdueTransactions: { fees: LoanOverduePreview; loan: Loan }[];
  openTransactions: PatronTransaction[];
  settings: ICirculationSetting[];
};

const DEFAULT_STATISTICS: CirculationStatistics = {
  feesEngaged: 0,
  fees: 0,
  overdueFees: 0,
  pending: 0,
  pickup: 0,
  loan: 0,
  ill: 0,
};

export const CirculationStore = signalStore(
  withState<CirculationState>({
    patron: undefined,
    statistics: { ...DEFAULT_STATISTICS },
    messages: [],
    overdueTransactions: [],
    openTransactions: [],
    settings: [],
  }),
  withComputed((store) => ({
    totalFeesEngaged: () => computeTotalTransactionsAmount(store.openTransactions()),
    patronPid: () => store.patron()?.pid,
  })),
  withMethods(
    (
      store,
      patronService = inject(PatronService),
      patronTransactionService = inject(PatronTransactionService),
      loanFixedDateService = inject(LoanFixedDateService)
    ) => ({

      /** Add or replace a checkout setting. Persists endDate if remember is set. */
      addSetting(setting: ICirculationSetting): void {
        patchState(store, state => ({ settings: [...state.settings.filter(s => s.key !== setting.key), setting] }));
        if (setting.key === 'endDate' && setting.extra?.remember && typeof setting.value === 'string') {
          loanFixedDateService.set(setting.value);
        }
      },

      /** Remove a checkout setting by key. Clears persisted endDate if needed. */
      removeSetting(key: string): void {
        const setting = store.settings().find(s => s.key === key);
        if (setting?.key === 'endDate' && setting.extra?.remember) {
          loanFixedDateService.remove();
        }
        patchState(store, state => ({ settings: state.settings.filter(s => s.key !== key) }));
      },
      /** Load patron by barcode and store in state. */
      loadPatron: rxMethod<string>(
        pipe(
          filter(Boolean),
          switchMap((barcode) =>
            patronService.getPatron(barcode).pipe(
              tap((patron) => patchState(store, { patron: patron ?? undefined })),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      /** Load circulation statistics for a patron. */
      loadStats: rxMethod<string | undefined>(
        pipe(
          filter(Boolean),
          switchMap((patronPid) =>
            patronService.getCirculationInformations(patronPid).pipe(
              tap((circulations: any) => {
                const stats = circulations.statistics;
                const data = { pending: 0, pickup: 0, loan: 0, ill: 0 };
                Object.keys(stats).forEach((key: string) => {
                  switch (key) {
                    case LoanState[LoanState.PENDING]:
                    case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
                      data.pending += Number(stats[key]);
                      break;
                    case LoanState[LoanState.ITEM_AT_DESK]:
                      data.pickup = Number(stats[key]);
                      break;
                    case LoanState[LoanState.ITEM_ON_LOAN]:
                      data.loan = Number(stats[key]);
                      break;
                    case 'ill_requests':
                      data.ill = Number(stats[key]);
                      break;
                  }
                });
                const messages: CirculationMessage[] = circulations.messages.map((msg: any) => ({
                  severity: getSeverity(msg.type),
                  detail: msg.content,
                }));
                patchState(store, (state) => ({
                  statistics: { ...state.statistics, ...data },
                  messages,
                }));
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      /** Load overdue preview and open transactions for a patron. */
      loadFees: rxMethod<string | undefined>(
        pipe(
          filter(Boolean),
          switchMap((patronPid) =>
            forkJoin([
              patronService.getOverduePreview(patronPid),
              patronTransactionService.patronTransactionsByPatron(patronPid, undefined, 'open'),
            ]).pipe(
              tap(([overdues, openTransactions]) => {
                let overdueFees = 0;
                overdues.forEach((item: any) => { overdueFees += item.fees.total; });
                const feesEngaged = computeTotalTransactionsAmount(openTransactions);
                patchState(store, (state) => ({
                  overdueTransactions: overdues,
                  openTransactions,
                  statistics: {
                    ...state.statistics,
                    overdueFees,
                    feesEngaged,
                    fees: overdueFees + feesEngaged,
                  },
                }));
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      /** Reload only open transactions (e.g., after a payment). */
      reloadOpenTransactions: rxMethod<string>(
        pipe(
          filter(Boolean),
          switchMap((patronPid) =>
            patronTransactionService.patronTransactionsByPatron(patronPid, undefined, 'open').pipe(
              tap((openTransactions) => {
                const feesEngaged = computeTotalTransactionsAmount(openTransactions);
                patchState(store, (state) => ({
                  openTransactions,
                  statistics: {
                    ...state.statistics,
                    feesEngaged,
                    fees: state.statistics.overdueFees + feesEngaged,
                  },
                }));
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      /** Clear all circulation state. */
      clear(): void {
        patchState(store, {
          patron: undefined,
          statistics: { ...DEFAULT_STATISTICS },
          messages: [],
          overdueTransactions: [],
          openTransactions: [],
          settings: [],
        });
      },

      /** Clear circulation messages only. */
      clearMessages(): void {
        patchState(store, { messages: [] });
      },
    })
  ),
  withHooks((store) => ({
    onInit: () => {
      store.loadFees(store.patronPid);
      store.loadStats(store.patronPid);
    },
  }))
);
