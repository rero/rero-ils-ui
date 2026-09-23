// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Error, EsResult } from "@rero/ng-core";
import { OperationLogsApiService, Pager, withPaginator } from "@rero/shared";
import { DateTime } from "luxon";
import { PaginatorState } from "primeng/paginator";
import { catchError, EMPTY, filter, pipe, switchMap, tap } from "rxjs";
import { TransactionRecord } from "../model/circulation.model";

type InitialState = {
  transactions: TransactionRecord[],
  total: number
};

const itemsInitialState: InitialState = {
  transactions: [],
  total: 0
};

const initialPagerConfig: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
}

export const transactionsHistoryStore = signalStore(
  withState<InitialState>(itemsInitialState),
  withPaginator(initialPagerConfig),
  withComputed((store) => ({
    dateTransactions: computed(() => {
      const grouped = store.transactions().reduce(
        (grouped: Record<string, TransactionRecord[]>, transaction: TransactionRecord) => {
          const date = DateTime.fromISO(transaction.metadata.date).toISODate() ?? transaction.metadata.date.substring(0, 10);
          grouped[date] ??= [];
          grouped[date].push(transaction);
          return grouped;
        },
        {}
      );
      return Object.fromEntries(
        Object.entries(grouped).sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      );
    }),
    isPaginatorEnabled: computed(() => store.pager.rows() < store.total()),
  })),
  withMethods((
    store,
    operationLogsApiService = inject(OperationLogsApiService)
  ) => ({
    setPaginator(paginator: PaginatorState, userPid?: string) {
      store.changePage(paginator);
      if (userPid) {
        this.loadTransactions(userPid);
      }
    },
    loadTransactions: rxMethod<string>(pipe(
      filter(Boolean),
      switchMap((userPid: string) =>
        operationLogsApiService.getCirculationTransactionsByUser(userPid, store.pager().page, store.pager().rows)
        .pipe(
          tap((result: EsResult | Error) => {
            if (!('hits' in result)) {
              return;
            }
            patchState(store, {
              transactions: (result.hits.hits ?? []) as TransactionRecord[],
              total: Number(result.hits.total) || 0
            });
          }),
          catchError(() => {
            return EMPTY;
          })
        )
      )
    ))
  }))
);
