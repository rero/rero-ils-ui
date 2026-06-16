// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { fee, overdueFee } from '../patron-profile-fees/types';

type FeesFeatureState = {
  fees: any[];
  feesLoaded: boolean;
};

function buildFees(feesResponse: EsResult, overdueResponse: overdueFee[]): fee[] {
  const records: fee[] = [];
  feesResponse.hits.hits.map((record: any) => {
    if (record.metadata?.loan) {
      const result = records.filter((fee: fee) => record.metadata?.loan?.pid === fee.loan?.pid);
      if (result.length === 1) {
        if (record.metadata.note) {
          result[0].notes.push(record.metadata.note);
        }
        result[0].totalAmount += record.metadata.total_amount;
        result[0].transactions.push(record);
      } else {
        records.push(buildFee(record));
      }
    } else {
      records.push(buildFee(record));
    }
  });
  overdueResponse.map((overdue: overdueFee) => {
    const result = records.filter((record: fee) => record.loan?.pid === overdue.loan.pid);
    if (result.length === 1) {
      result[0].totalAmount += overdue.fees.total;
      result[0].overdue = overdue.fees.total;
    } else {
      records.push({
        type: 'overdue',
        createdAt: new Date(),
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

function buildFee(record: any): fee {
  const result: fee = {
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

export function withFeesFeature() {
  return signalStoreFeature(
    { state: type<{ patronPid: string | null }>() },
    withState<FeesFeatureState>({
      fees: [],
      feesLoaded: false,
    }),
    withMethods((
      store,
      patronTransactionApiService = inject(PatronTransactionApiService),
      patronApiService = inject(PatronApiService)
    ) => ({
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
              tap(([feesResponse, overdueResponse]: [EsResult, overdueFee[]]) => {
                const fees = buildFees(feesResponse, overdueResponse);
                patchState(store, {
                  fees,
                  feesLoaded: true,
                });
              })
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
