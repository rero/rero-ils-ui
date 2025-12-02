/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
  withPaginator(initialPagerConfig),
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
      patchState(store, { filter, pager: initialPagerConfig });
    }),
    setPaginator(paginator: PaginatorState) {
      store.changePage(paginator);
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
            patchState(
              store,
              { items: store.items().filter((h: EsRecord) => h.metadata.pid !== store.record().metadata.pid), record: null }
            )
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
