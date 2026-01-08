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
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';

type RequestsState = {
    requests: any[];
    requestsLoading: boolean;
    cancelInProgress: boolean;
    currentPatronPid: string | undefined;
    page: number;
    itemsPerPage: number;
    total: number;
};

const initialState: RequestsState = {
    requests: [],
    requestsLoading: false,
    cancelInProgress: false,
    currentPatronPid: undefined,
    page: 0,
    itemsPerPage: 10,
    total: 0,
};

export const RequestsStore = signalStore(
    { providedIn: 'root' },
    withState<RequestsState>(initialState),

    withComputed((state) => ({
        /** Check if more requests are available */
        hasMore: computed(() => state.requests().length < state.total()),
    })),

    withMethods((store, loanApi = inject(LoanApiService),
        messageService = inject(MessageService),
        translate = inject(TranslateService)) => {

        const loadRequests = rxMethod<{ patronPid: string; page: number }>(
            pipe(
                tap(() => patchState(store, { requestsLoading: true })),
                switchMap(({ patronPid, page }) =>
                    loanApi.getRequest(patronPid, page, store.itemsPerPage())
                ),
                tap((response: Record) => {
                    const currentPage = response.hits.hits;
                    const newRequests =
                        store.page() === 0
                            ? currentPage
                            : [...store.requests(), ...currentPage];
                    patchState(store, {
                        requests: newRequests,
                        total: response.hits.total.value,
                        page: store.page() + 1,
                        requestsLoading: false,
                    });
                }),
                catchError(() => {
                    patchState(store, { requestsLoading: false });
                    return of(null);
                })
            )
        );

        const cancelRequest = rxMethod<{
            pid: string;
            transactionLocationPid: string;
            transactionUserPid: string;
        }>(
            pipe(
                tap(() => patchState(store, { cancelInProgress: true })),
                switchMap((data) =>
                    loanApi.cancel({
                        pid: data.pid,
                        transaction_location_pid: data.transactionLocationPid,
                        transaction_user_pid: data.transactionUserPid,
                    })
                ),
                tap((result) => {
                    if (result !== undefined) {
                        // Remove canceled request from list
                        const updatedRequests = store.requests().filter(
                            (r: any) => r.metadata.pid !== result.pid
                        );
                        patchState(store, {
                            requests: updatedRequests,
                            total: store.total() - 1,
                            cancelInProgress: false,
                        });
                        messageService.add({
                            severity: 'success',
                            summary: translate.instant('Success'),
                            detail: translate.instant('The request has been cancelled.'),
                            life: CONFIG.MESSAGE_LIFE,
                        });
                    } else {
                        patchState(store, { cancelInProgress: false });
                        messageService.add({
                            severity: 'error',
                            summary: translate.instant('Error'),
                            detail: translate.instant(
                                'Error during the cancellation of the request.'
                            ),
                            closable: true,
                        });
                    }
                }),
                catchError(() => {
                    patchState(store, { cancelInProgress: false });
                    messageService.add({
                        severity: 'error',
                        summary: translate.instant('Error'),
                        detail: translate.instant('Error during the cancellation of the request.'),
                        closable: true,
                    });
                    return of(null);
                })
            )
        );

        return {
            loadRequests,
            cancelRequest,
            /** Load more requests (next page) */
            loadMore(): void {
                if (store.hasMore() && !store.requestsLoading()) {
                    const patronPid = store.currentPatronPid();
                    if (patronPid) {
                        loadRequests({ patronPid, page: store.page() + 1 });
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
                store.loadRequests({ patronPid: patron.pid, page: 1 });
            }
        },

        /** React to patron changes */
        __patronEffect: effect(() => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, {
                    currentPatronPid: patron.pid,
                    requests: [],
                    page: 0,
                    total: 0,
                });
                store.loadRequests({ patronPid: patron.pid, page: 1 });
            }
        }),
    }))
);
