// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { Pager, withPaginator } from '@rero/shared';
import { tap } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';

type RequestsFeatureState = {
  requests: any[];
  requestsTotal: number;
  requestsLoaded: boolean;
  cancelledRequestPid: string | null;
};

const initialRequestPager: Pager = {
  page: 1,
  first: 1,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50]
};

export function withRequestsFeature() {
  return signalStoreFeature(
    withState<RequestsFeatureState>({
      requests: [],
      requestsTotal: 0,
      requestsLoaded: false,
      cancelledRequestPid: null,
    }),
    withPaginator('requestPager', initialRequestPager),
    withMethods((store, loanApiService = inject(LoanApiService)) => ({
      resetRequests(): void {
        patchState(store, {
          requests: [],
          requestsTotal: 0,
          requestsLoaded: false,
          requestPager: initialRequestPager,
        });
      },
      loadRequests(patronPid: string, page: number, recordsPerPage: number) {
        return loanApiService.getRequest(patronPid, page, recordsPerPage).pipe(
          tap(response => {
            if (!('hits' in response)) return;
            patchState(store, {
              requests: response.hits.hits,
              requestsTotal: response.hits.total.value,
              requestsLoaded: true,
            });
          })
        );
      },
      cancelPatronRequest(record: any, patronPid: string) {
        const metadata = record?.metadata;
        return loanApiService.cancel({
          pid: metadata?.pid,
          transaction_location_pid: metadata?.item.location.pid,
          transaction_user_pid: patronPid
        }).pipe(
          tap((cancelLoan: any) => {
            if (cancelLoan !== undefined) {
              patchState(store, {
                cancelledRequestPid: metadata?.pid,
                requests: store.requests().filter(record => record.metadata.pid !== metadata?.pid),
                requestsTotal: Math.max(0, store.requestsTotal() - 1),
              });
            }
          })
        );
      },
    }))
  );
}
