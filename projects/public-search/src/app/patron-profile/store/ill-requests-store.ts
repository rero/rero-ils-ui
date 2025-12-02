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
import { BaseApi } from '@rero/shared';
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';

type IllRequestsState = {
    illRequests: any[];
    illRequestsLoading: boolean;
    currentPatronPid: string | undefined;
    page: number;
    itemsPerPage: number;
    total: number;
};

const initialState: IllRequestsState = {
    illRequests: [],
    illRequestsLoading: false,
    currentPatronPid: undefined,
    page: 0,
    itemsPerPage: 10,
    total: 0,
};

export const IllRequestsStore = signalStore(
    { providedIn: 'root' },
    withState<IllRequestsState>(initialState),

    withComputed((state) => ({
        /** Check if more requests are available */
        hasMore: computed(() => state.illRequests().length < state.total()),
    })),

    withMethods((store, illRequestApi = inject(IllRequestApiService)) => {
        const loadIllRequests = rxMethod<{ patronPid: string; page: number }>(
            pipe(
                tap(() => patchState(store, { illRequestsLoading: true })),
                switchMap(({ patronPid, page }) =>
                    illRequestApi.getPublicIllRequest(
                        patronPid,
                        page,
                        store.itemsPerPage(),
                        BaseApi.reroJsonheaders,
                        '-created',
                        { remove_archived: '1' }
                    )
                ),
                tap((response: Record) => {
                    const currentPage = response.hits.hits;
                    const newRequests =
                        store.page() === 0
                            ? currentPage
                            : [...store.illRequests(), ...currentPage];
                    patchState(store, {
                        illRequests: newRequests,
                        total: response.hits.total.value,
                        page: store.page() + 1,
                        illRequestsLoading: false,
                    });
                }),
                catchError(() => {
                    patchState(store, { illRequestsLoading: false });
                    return of(null);
                })
            )
        );

        return {
            loadIllRequests,
            /** Load more requests (next page) */
            loadMore(): void {
                if (store.hasMore() && !store.illRequestsLoading()) {
                    const patronPid = store.currentPatronPid();
                    if (patronPid) {
                        loadIllRequests({ patronPid, page: store.page() + 1 });
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
                store.loadIllRequests({ patronPid: patron.pid, page: 1 });
            }
        },

        /** React to patron changes */
        __patronEffect: effect(() => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, {
                    currentPatronPid: patron.pid,
                    illRequests: [],
                    page: 0,
                    total: 0,
                });
                store.loadIllRequests({ patronPid: patron.pid, page: 1 });
            }
        }),
    }))
);
