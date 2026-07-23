// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { BaseApi, Pager, withPaginator } from '@rero/shared';
import { tap } from 'rxjs';
import { IllRequestApiService } from '../../api/ill-request-api.service';

type IllRequestsFeatureState = {
  illRequests: any[];
  illRequestsTotal: number;
  illRequestsLoaded: boolean;
};

const initialIllRequestsPager: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
};

export function withIllRequestsFeature() {
  return signalStoreFeature(
    withState<IllRequestsFeatureState>({
      illRequests: [],
      illRequestsTotal: 0,
      illRequestsLoaded: false,
    }),
    withPaginator('illRequestsPager', initialIllRequestsPager),
    withMethods((store, illRequestApiService = inject(IllRequestApiService)) => ({
      resetIllRequests(): void {
        patchState(store, {
          illRequests: [],
          illRequestsTotal: 0,
          illRequestsLoaded: false,
          illRequestsPager: initialIllRequestsPager,
        });
      },
      loadIllRequests(patronPid: string, page: number, recordsPerPage: number) {
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
              illRequestsTotal: response.hits.total.value,
              illRequestsLoaded: true,
            });
          })
        );
      },
    }))
  );
}
