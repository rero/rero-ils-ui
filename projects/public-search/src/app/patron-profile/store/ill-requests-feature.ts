// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject, type Signal } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { searchTotalValue } from '@rero/ng-core';
import { BaseApi, nextPager, Pager } from '@rero/shared';
import { PaginatorState } from 'primeng/paginator';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IllRequestApiService } from '../../api/ill-request-api.service';

type IllRequestsFeatureState = {
  illRequests: any[];
  illRequestsTotal: number;
  illRequestsLoaded: boolean;
  illRequestsPager: Pager;
};

type LoadIllRequestsInput = {
  patronPid: string | null;
  active: boolean;
  page: number;
  recordsPerPage: number;
};

const initialIllRequestsPager: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
};

/** Add ILL request state and pagination to the patron profile store. */
export function withIllRequestsFeature<_>() {
  return signalStoreFeature(
    {
      state: type<{ activeTab: string | null }>(),
      props: type<{
        patronPid: Signal<string | null>;
      }>(),
    },
    withState<IllRequestsFeatureState>({
      illRequests: [],
      illRequestsTotal: 0,
      illRequestsLoaded: false,
      illRequestsPager: initialIllRequestsPager,
    }),
    withMethods((store, illRequestApiService = inject(IllRequestApiService)) => ({
      /** Clear ILL requests and restore the first page for another patron. */
      resetIllRequests(): void {
        patchState(store, {
          illRequests: [],
          illRequestsTotal: 0,
          illRequestsLoaded: false,
          illRequestsPager: initialIllRequestsPager,
        });
      },
      /** Store the new page; the reactive loader performs the API call. */
      changeIllRequestsPager(event: PaginatorState): void {
        patchState(store, {
          illRequestsPager: nextPager(store.illRequestsPager(), event),
        });
      },
      /** Load the active ILL request page whenever one of its inputs changes. */
      loadIllRequests: rxMethod<LoadIllRequestsInput>(
        pipe(
          switchMap(({ patronPid, active, page, recordsPerPage }) => {
            if (!patronPid || !active) return of([]);

            patchState(store, { illRequestsLoaded: false });

            return illRequestApiService.getPublicIllRequest(
              patronPid,
              page,
              recordsPerPage,
              BaseApi.reroJsonheaders,
              '-created',
              { remove_archived: '1' }
            ).pipe(
              tap(response => {
                if (!('hits' in response)) return;
                patchState(store, {
                  illRequests: response.hits.hits,
                  illRequestsTotal: searchTotalValue(response.hits.total),
                });
              }),
              catchError(error => {
                console.error(error);
                return of(null);
              }),
              finalize(() => patchState(store, { illRequestsLoaded: true }))
            );
          })
        )
      )
    })),
    withHooks({
      onInit(store) {
        store.loadIllRequests(computed(() => ({
          patronPid: store.patronPid(),
          active: store.activeTab() === 'illRequest',
          page: store.illRequestsPager().page,
          recordsPerPage: store.illRequestsPager().rows,
        })));
      },
    })
  );
}
