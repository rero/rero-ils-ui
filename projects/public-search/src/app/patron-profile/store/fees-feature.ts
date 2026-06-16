// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, type Signal } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { catchError, finalize, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { Fee, OverdueFee } from '../patron-profile-fees/types';

type FeesFeatureState = {
  fees: Fee[];
  feesLoaded: boolean;
};

/**
 * Merge transaction fees and overdue fees belonging to the same loan.
 */
function buildFees(feesResponse: EsResult, overdueResponse: OverdueFee[]): Fee[] {
  const records: Fee[] = [];
  feesResponse.hits.hits.map((record: any) => {
    if (record.metadata?.loan) {
      const fee = records.find((fee: Fee) => record.metadata?.loan?.pid === fee.loan?.pid);
      if (fee) {
        if (record.metadata.note) {
          fee.notes.push(record.metadata.note);
        }
        fee.totalAmount += record.metadata.total_amount;
        fee.transactions.push(record);
      } else {
        records.push(buildFee(record));
      }
    } else {
      records.push(buildFee(record));
    }
  });
  overdueResponse.map((overdue: OverdueFee) => {
    const fee = records.find((record: Fee) => record.loan?.pid === overdue.loan.pid);
    if (fee) {
      fee.totalAmount += overdue.fees.total;
      fee.overdue = overdue.fees.total;
    } else {
      records.push({
        type: 'overdue',
        createdAt: new Date(),
        notes: [],
        loan: overdue.loan,
        totalAmount: overdue.fees.total,
        overdue: overdue.fees.total,
        transactions: []
      });
    }
  });
  records.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return records;
}

/** Build a fee displayed in the patron profile. */
function buildFee(record: any): Fee {
  const result: Fee = {
    type: record.metadata.type,
    notes: [],
    createdAt: new Date(record.metadata.creation_date),
    totalAmount: record.metadata.total_amount,
    transactions: [record]
  };
  if (record.metadata.note) {
    result.notes.push(record.metadata.note);
  }
  if (record.metadata.loan) {
    result.loan = record.metadata.loan;
  }
  return result;
}

/** Add fee state and loading methods to the patron profile store. */
export function withFeesFeature<_>() {
  return signalStoreFeature(
    { props: type<{ patronPid: Signal<string | null> }>() },
    withState<FeesFeatureState>({
      fees: [],
      feesLoaded: false,
    }),
    withMethods((
      store,
      patronTransactionApiService = inject(PatronTransactionApiService),
      patronApiService = inject(PatronApiService)
    ) => ({
      resetFees(): void {
        patchState(store, {
          fees: [],
          feesLoaded: false,
        });
      },
      /**
       * Load transaction and overdue fees together for the current patron.
       */
      loadFees: rxMethod<string | null>(
        pipe(
          switchMap(patronPid => {
            if (!patronPid) return of([]);

            patchState(store, {
              fees: [],
              feesLoaded: false,
            });
            const queryFees = patronTransactionApiService.getFees(
              patronPid,
              'open',
              1,
              RecordService.MAX_REST_RESULTS_SIZE
            );
            const queryOverdue = patronApiService.getOverduePreviewByPatronPid(patronPid);

            return forkJoin([queryFees, queryOverdue]).pipe(
              tap(([feesResponse, overdueResponse]) => {
                if (!('hits' in feesResponse)) {
                  throw feesResponse;
                }

                const fees = buildFees(feesResponse, overdueResponse);

                patchState(store, { fees });
              }),
              catchError(error => {
                console.error(error);
                return of(null);
              }),
              finalize(() => patchState(store, { feesLoaded: true }))
            );
          })
        )
      ),
    })),
    withHooks({
      onInit(store) {
        store.loadFees(store.patronPid);
      },
    })
  );
}
