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

import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { Record } from '@rero/ng-core';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';

type HistoriesState = {
    history: any[];
    historyLoading: boolean;
    currentPatronPid: string | undefined;
    page: number;
    itemsPerPage: number;
    total: number;
};

const initialState: HistoriesState = {
    history: [],
    historyLoading: false,
    currentPatronPid: undefined,
    page: 0,
    itemsPerPage: 10,
    total: 0,
};

export const HistoriesStore = signalStore(
    { providedIn: 'root' },
    withState<HistoriesState>(initialState),

    withComputed((state) => ({
        /** Check if more history records are available */
        hasMore: computed(() => state.history().length < state.total()),
    })),

    withMethods((store, operationLogsApi = inject(OperationLogsApiService)) => {
        const loadHistory = rxMethod<{ patronPid: string; page: number }>(
            pipe(
                tap(() => patchState(store, { historyLoading: true })),
                switchMap(({ patronPid, page }) =>
                    operationLogsApi.getHistory(
                        patronPid,
                        page,
                        store.itemsPerPage()
                    )
                ),
                tap((response: Record) => {
                    const currentPage = response.hits.hits;
                    const newHistory =
                        store.page() === 0
                            ? currentPage
                            : [...store.history(), ...currentPage];
                    patchState(store, {
                        history: newHistory,
                        total: response.hits.total.value,
                        page: store.page() + 1,
                        historyLoading: false,
                    });
                }),
                catchError(() => {
                    patchState(store, { historyLoading: false });
                    return of(null);
                })
            )
        );

        return {
            loadHistory,
            /** Load more history (next page) */
            loadMore(): void {
                if (store.hasMore() && !store.historyLoading()) {
                    const patronPid = store.currentPatronPid();
                    if (patronPid) {
                        loadHistory({ patronPid, page: store.page() + 1 });
                    }
                }
            },
        };
    }),

    withHooks((store, menuStore = inject(PatronProfileMenuStore)) => ({
        onInit: () => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, { currentPatronPid: patron.pid });
                store.loadHistory({ patronPid: patron.pid, page: 1 });
            }
        },

        /** React to patron changes */
        __patronEffect: effect(() => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, {
                    currentPatronPid: patron.pid,
                    history: [],
                    page: 0,
                    total: 0,
                });
                store.loadHistory({ patronPid: patron.pid, page: 1 });
            }
        }),
    }))
);
