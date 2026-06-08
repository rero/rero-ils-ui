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
import { HoldingsApiService } from "@app/admin/api/holdings-api.service";
import { HoldingsService, PredictionIssue } from "@app/admin/service/holdings.service";
import { patchState, signalMethod, signalStore, withComputed, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { CONFIG, RecordUiService } from "@rero/ng-core";
import { AppStore, EsRecord, EsResult, nonNullable, Pager, PERMISSIONS, withPaginator } from "@rero/shared";
import { MessageService } from "primeng/api";
import { PaginatorState } from "primeng/paginator";
import { numberGreatThan } from "@rero/shared";
import { catchError, debounceTime, pipe, switchMap, tap } from "rxjs";

type HoldingsSerialState = {
  holdings: EsRecord | undefined;
  filter: string | undefined;
  filterTotal: number;
  receivedItems: EsRecord[] | undefined;
  receivedItemsCount: number;
  issues: PredictionIssue[] | undefined;
  issuesCount: number;
  allowIssueCreation: boolean;
  quickReceive: boolean;
  quickReceiveDisableButton: boolean;
  reload: boolean;
}

const initialState: HoldingsSerialState = {
  holdings: undefined,
  filter: undefined,
  filterTotal: 0,
  receivedItems: undefined,
  receivedItemsCount: 0,
  issues: undefined,
  issuesCount: 3,
  allowIssueCreation: false,
  quickReceive: false,
  quickReceiveDisableButton: false,
  reload: false,
};

export const localFieldsPermissions = [
  PERMISSIONS.LOFI_SEARCH,
  PERMISSIONS.LOFI_CREATE
];

const initialPagerConfig: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
}

export const HoldingsSerialStore = signalStore(
  withState(initialState),
  withPaginator(initialPagerConfig),
  withProps(() => ({
    holdingsService: inject(HoldingsService),
    holdingsApiService: inject(HoldingsApiService),
    messageService: inject(MessageService),
    translateService: inject(TranslateService),
    appStore: inject(AppStore),
    recordUiService: inject(RecordUiService),
  })),
  withComputed((store) => ({
    isFilterEnabled: computed(() => store.receivedItemsCount() >= 11 || '' !== store.filter()),
    isPaginatorEnabled: computed(() => store.pager.rows() < store.filterTotal()),
    isAllowIssueCreation: computed(() => store.appStore.currentLibraryPid() === store.holdings().metadata.library.pid),
    isDisplayLocalFieldsTab: computed(() =>
      store.appStore.canAccess(localFieldsPermissions)
      && store.appStore.currentLibraryPid() === store.holdings().metadata.library.pid
    ),
  })),
  withMethods((store) => ({
    setHoldings: signalMethod<EsRecord>((holdings: EsRecord) => {
      patchState(store, { holdings });
    }),
    setFilter: signalMethod<string>((filter: string) => {
      patchState(store, { filter, pager: { ...store.pager(), page: 1, first: 1 } });
    }),
    setPaginator(paginator: PaginatorState) {
      store.changePage(paginator);
    },
    loadItems: rxMethod<void>(
      pipe(
        debounceTime(400),
        switchMap(() => store.holdingsApiService.getIssuesByHoldings(
          store.holdings().metadata.pid,
          store.pager.page(),
          store.pager.rows(),
          store.quickReceive(),
          store.filter()
        )),
        tap((result: EsResult) => {
          if (!store.filter()) {
            patchState(store, { receivedItemsCount: result.hits.total.value });
          }
          patchState(store, {
            receivedItems: result.hits.hits,
            filterTotal: result.hits.total.value,
            quickReceive: false
          });
        }),
        tap(() => patchState(store, { reload: false }))
      ),
    ),
    updateItem(item: EsRecord) {
      const current = store.receivedItems();
      if (current) {
        patchState(store, {
          receivedItems: current.map(i => i.metadata.pid === item.metadata.pid ? item : i)
        });
      }
    },
    deleteItem: rxMethod<EsRecord>(
      pipe(
        switchMap((item: EsRecord) => store.recordUiService.deleteRecord('items', item.metadata.pid)),
        tap((success: boolean) => {
          if (success) {
            const rows = store.pager.rows();
            const newTotal = store.filterTotal() - 1;
            const lastPage = Math.max(1, Math.ceil(newTotal / rows));
            const page = Math.min(store.pager.page(), lastPage);
            patchState(store, {
              reload: true,
              filter: undefined,
              pager: { ...store.pager(), page, first: (page - 1) * rows + 1 }
            });
          }
        })
      )
    ),
    loadIssues: rxMethod<void>(
      pipe(
        switchMap(() => store.holdingsService.getHoldingPatternPreview(store.holdings().metadata.pid, store.issuesCount())),
        tap((issues: PredictionIssue[]) => patchState(store, { issues }))
      )
    ),
    moreIssues: (count: number) => patchState(store, { issuesCount: store.issuesCount() + count }),
    quickIssueReceive: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { quickReceiveDisableButton: true })),
        switchMap(() => store.holdingsService.quickReceivedIssue(store.holdings())),
        catchError(() => undefined),
        tap((result) => {
          if (result) {
            patchState(store, { quickReceive: true, pager: { ...store.pager(), page: 1, first: 1 } });
          } else {
            store.messageService.add({
              severity: 'error',
              summary: store.translateService.instant('Issue creation failed!'),
              sticky: true,
              closable: true
            });
          }
        }),
        tap(() => store.messageService.add({
          severity: 'success',
          summary: store.translateService.instant('Issue'),
          detail: store.translateService.instant('New issue created.'),
          life: CONFIG.MESSAGE_LIFE
        })),
        tap(() => patchState(store, { quickReceiveDisableButton: false })),
      )
    )
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store.holdings).pipe(nonNullable()).subscribe(() => {
        store.loadItems();
        store.loadIssues();
      });
      toObservable(store.quickReceive).pipe(nonNullable()).subscribe(() => {
        if (store.quickReceive()) {
          store.loadItems();
          store.loadIssues();
        }
      });
      toObservable(store.issuesCount).pipe(numberGreatThan(3)).subscribe(() => store.loadIssues());
      toObservable(store.filter).pipe(nonNullable()).subscribe(() => store.loadItems());
      toObservable(store.pager).pipe(nonNullable()).subscribe(() => store.loadItems());
      toObservable(store.reload).subscribe(reload => {
        if (reload) {
          store.loadItems();
        }
      })
    }
  }))
)
