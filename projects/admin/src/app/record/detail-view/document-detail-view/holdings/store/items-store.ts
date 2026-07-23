// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { patchState, signalMethod, signalStore, withComputed, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { RecordUiService } from "@rero/ng-core";
import { EsRecord, EsResult, nonNullable, Pager, setFulfilled, setPending, withPaginator, withRequestStatus } from "@rero/shared";
import { PaginatorState } from "primeng/paginator";
import { debounceTime, pipe, switchMap, tap } from "rxjs";
import { ItemApiService } from "../../../../../api/item-api.service";

type ItemsState = {
  items: EsRecord[],
  record: EsRecord | undefined;
  total: number;
  holdings: EsRecord | undefined;
  filter: string | undefined;
  filterTotal: number;
}

const itemsInitialState: ItemsState = {
  items: [],
  record: undefined,
  total: 0,
  holdings: undefined,
  filter: undefined,
  filterTotal: 0
}

const initialPagerConfig: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
}

export const ItemsStore = signalStore(
  withState<ItemsState>(itemsInitialState),
  withPaginator('pager', initialPagerConfig),
  withRequestStatus(),
  withProps(() => ({
    recordUiService: inject(RecordUiService),
    itemsApiService: inject(ItemApiService),
  })),
  withComputed((store) => ({
    holdingType: computed(() => store.holdings().metadata.holdings_type),
    isFilterEnabled: computed(() => store.total() >= 11 || '' !== store.filter()),
    isPaginatorEnabled: computed(() => store.pager.rows() < store.filterTotal()),
  })),
  withMethods((store) => ({
    setHoldings(holdings: EsRecord) {
      patchState(store, { holdings });
    },
    setFilter: signalMethod<string>((filter?: string) => {
      patchState(store, { filter, pager: { ...store.pager(), page: 1, first: 1 } });
    }),
    setPaginator(paginator: PaginatorState) {
      store.changePager(paginator);
    },
    load: rxMethod<void>(
      pipe(
        debounceTime(400),
        tap(() => patchState(store, setPending())),
        switchMap(() => store.itemsApiService.getItemsByHoldings(
          store.holdings(),
          store.pager.page(),
          store.pager.rows(),
          store.filter()
        )),
        tap((result: EsResult) => {
          if (store.filter()) {
            patchState(
              store,
              { items: result.hits.hits, filterTotal: result.hits.total.value },
              setFulfilled()
            );
          } else {
            patchState(
              store,
              { items: result.hits.hits, total: result.hits.total.value, filterTotal: result.hits.total.value },
              setFulfilled()
            );
          }
        }),
      )
    ),
    delete: rxMethod<EsRecord>(
      pipe(
        tap((record: EsRecord) => patchState(store, { record })),
        switchMap(() => store.recordUiService.deleteRecord('items', store.record().metadata.pid)),
        tap((success: boolean) => {
          if (success) {
            const rows = store.pager.rows();
            const newTotal = store.filterTotal() - 1;
            const lastPage = Math.max(1, Math.ceil(newTotal / rows));
            const page = Math.min(store.pager.page(), lastPage);
            const deletedPid = store.record()?.metadata.pid;
            patchState(store, {
              items: store.items().filter((h: EsRecord) => h.metadata.pid !== deletedPid),
              total: store.total() - 1,
              filterTotal: newTotal,
              record: undefined,
              pager: { ...store.pager(), page, first: (page - 1) * rows + 1 }
            });
          }
        })
      )
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store.holdings).subscribe(() => store.load());
      toObservable(store.filter).pipe(nonNullable()).subscribe(() => store.load());
      toObservable(store.pager).pipe(nonNullable()).subscribe(() => store.load());
    }
  }))
);
