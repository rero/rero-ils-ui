// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject, type Signal } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { _, TranslateService } from '@ngx-translate/core';
import { CONFIG, searchTotalValue } from '@rero/ng-core';
import { nextPager, Pager } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { catchError, exhaustMap, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';

type RequestsFeatureState = {
  requests: any[];
  requestsTotal: number;
  requestsLoaded: boolean;
  cancelledRequestPid: string | null;
  cancellingRequestPid: string | null;
  requestPager: Pager;
};

type LoadRequestsInput = {
  patronPid: string | null;
  active: boolean;
  page: number;
  recordsPerPage: number;
};

const initialRequestPager: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
};

const notifyCancellation = (
  success: boolean,
  translateService: TranslateService,
  messageService: MessageService
) => {
  if (success) {
    messageService.add({
      severity: 'success',
      summary: translateService.instant(_('Success')),
      detail: translateService.instant(_('The request has been cancelled.')),
      life: CONFIG.MESSAGE_LIFE,
    });
  } else {
    messageService.add({
      severity: 'error',
      summary: translateService.instant(_('Error')),
      detail: translateService.instant(_('Error during the cancellation of the request.')),
      closable: true,
    });
  }
};

/** Add request state, pagination and actions to the patron profile store. */
export function withRequestsFeature<_>() {
  return signalStoreFeature(
    {
      state: type<{ activeTab: string | null }>(),
      props: type<{
        patronPid: Signal<string | null>;
      }>(),
    },
    withState<RequestsFeatureState>({
      requests: [],
      requestsTotal: 0,
      requestsLoaded: false,
      cancelledRequestPid: null,
      cancellingRequestPid: null,
      requestPager: initialRequestPager,
    }),
    withMethods((
      store,
      loanApiService = inject(LoanApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService)
    ) => ({
      /** Clear requests and restore the first page for another patron. */
      resetRequests(): void {
        patchState(store, {
          requests: [],
          requestsTotal: 0,
          requestsLoaded: false,
          requestPager: initialRequestPager,
        });
      },
      /** Store the new page; the reactive loader performs the API call. */
      changeRequestPager(event: PaginatorState): void {
        patchState(store, {
          requestPager: nextPager(store.requestPager(), event),
        });
      },
      /** Load the active request page whenever one of its inputs changes. */
      loadRequests: rxMethod<LoadRequestsInput>(
        pipe(
          switchMap(({ patronPid, active, page, recordsPerPage }) => {
            if (!patronPid || !active) return of([]);

            patchState(store, { requestsLoaded: false });

            return loanApiService.getRequest(patronPid, page, recordsPerPage).pipe(
              tap(response => {
                if (!('hits' in response)) return;
                patchState(store, {
                  requests: response.hits.hits,
                  requestsTotal: searchTotalValue(response.hits.total),
                });
              }),
              catchError(error => {
                console.error(error);
                return of(null);
              }),
              finalize(() => patchState(store, { requestsLoaded: true }))
            );
          })
        )
      ),
      /** Cancel one patron request and remove it from the current page. */
      cancelPatronRequest: rxMethod<string>(
        pipe(
          exhaustMap(requestPid => {
            const patronPid = store.patronPid();
            const request = store.requests().find(request => request.metadata?.pid === requestPid);
            if (!patronPid || !request) {
              notifyCancellation(false, translateService, messageService);
              return of(undefined);
            }

            patchState(store, { cancellingRequestPid: requestPid });
            return loanApiService.cancel({
              pid: requestPid,
              transaction_location_pid: request.metadata?.item.location.pid,
              transaction_user_pid: patronPid
            }).pipe(
              tap(cancelledRequest => {
                const success = cancelledRequest !== undefined;
                if (success) {
                  patchState(store, {
                    cancelledRequestPid: requestPid,
                    requests: store.requests().filter(request => request.metadata.pid !== requestPid),
                    requestsTotal: Math.max(0, store.requestsTotal() - 1),
                  });
                }
                notifyCancellation(success, translateService, messageService);
              }),
              catchError(() => {
                notifyCancellation(false, translateService, messageService);
                return of(undefined);
              }),
              finalize(() => patchState(store, { cancellingRequestPid: null }))
            );
          })
        )
      ),
    })),
    withHooks({
      onInit(store) {
        store.loadRequests(computed(() => ({
          patronPid: store.patronPid(),
          active: store.activeTab() === 'request',
          page: store.requestPager().page,
          recordsPerPage: store.requestPager().rows,
        })));
      },
    })
  );
}
