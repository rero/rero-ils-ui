// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { patchState, signalMethod, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { EsRecord, nonNullable, Pager, withPaginator } from "@rero/shared";
import { PaginatorState } from "primeng/paginator";
import { EsResult, withViewCode } from "@rero/shared";
import { debounceTime, pipe, switchMap, tap } from "rxjs";
import { ItemApiService } from "../../api/item-api.service";

type Items = {
  items: EsRecord[],
  total: number;
  holdings: Partial<EsRecord>;
  filter: string | undefined;
  filterTotal: number;
}

const itemsInitialState: Items = {
  items: [],
  total: 0,
  holdings: {},
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
  withState(itemsInitialState),
  withPaginator(initialPagerConfig),
  withViewCode(),
  withComputed((store) => ({
    isFilterEnabled: computed(() => store.total() > 10 || '' !== store.filter()),
    isPaginatorEnabled: computed(() => store.pager.rows() < store.filterTotal()),
  })),
  withMethods((store, itemApiService = inject(ItemApiService)) => ({
    setHoldingsAndViewCode(holdings: EsRecord, viewCode: string) {
      patchState(store, { holdings, viewCode })
    },
    setFilter: signalMethod<string>((filter: string) => {
      patchState(store, { filter, pager: initialPagerConfig });
    }),
    setPaginator(paginator: PaginatorState) {
      store.changePage(paginator);
    },
    load: rxMethod<void>(
      pipe(
        debounceTime(400),
        switchMap(() => itemApiService.getItemsByHoldingsAndViewcode(
          store.holdings(),
          store.viewCode(),
          store.pager.page(),
          store.pager.rows(),
          store.filter()
        )),
        tap((result: EsResult) => {
          if (store.filter()) {
            patchState(store, { items: result.hits.hits, filterTotal: result.hits.total.value })
          } else {
            patchState(store, {
              items: result.hits.hits,
              total: result.hits.total.value,
              filterTotal: result.hits.total.value
            });
          }
        }),
      )
    )
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store.filter).pipe(nonNullable()).subscribe(() => store.load());
      toObservable(store.pager).subscribe(() => store.load())
    }
  }))
);
