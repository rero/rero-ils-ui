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

import { effect, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Record, RecordService } from '@rero/ng-core';
import { forkJoin, of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { fee, overdueFee } from '../patron-profile-fees/types';
import { PatronProfileMenuStore } from './patron-profile-menu-store';

type FeesState = {
    fees: fee[];
    feesLoading: boolean;
    currentPatronPid: string | undefined;
};

const initialState: FeesState = {
    fees: [],
    feesLoading: false,
    currentPatronPid: undefined,
};

export const FeesStore = signalStore(
    { providedIn: 'root' },
    withState<FeesState>(initialState),
    withMethods((store, patronTransactionApi = inject(PatronTransactionApiService), patronApi = inject(PatronApiService)) => {

        const createFee = (record: any): fee => {
            const newFee: fee = {
                type: record.metadata.type,
                notes: [],
                createdAt: new Date(record.metadata.creation_date),
                totalAmount: record.metadata.total_amount,
                transactions: [record]
            };
            if (record.metadata.note) {
                newFee.notes.push(record.metadata.note);
            }
            if (record.metadata.loan) {
                newFee.loan = record.metadata.loan;
            }
            return newFee;
        };

        const processFees = (feesResponse: Record, overdueResponse: overdueFee[]): fee[] => {
            const records: fee[] = [];

            // Process transactions
            feesResponse.hits.hits.forEach(record => {
                if (record.metadata?.loan) {
                    const result = records.filter((f: fee) => record.metadata?.loan?.pid === f.loan?.pid);
                    if (result.length === 1) {
                        if (record.metadata.note) {
                            result[0].notes.push(record.metadata.note);
                        }
                        result[0].totalAmount += record.metadata.total_amount;
                        result[0].transactions.push(record);
                    } else {
                        records.push(createFee(record));
                    }
                } else {
                    records.push(createFee(record));
                }
            });

            // Process overdue fees
            overdueResponse.forEach((overdue: overdueFee) => {
                const result = records.filter((record: fee) => record.loan?.pid === overdue.loan.pid);
                if (result.length === 1) {
                    result[0].totalAmount += overdue.fees.total;
                    result[0].overdue = overdue.fees.total;
                } else {
                    const overdueRecord: fee = {
                        type: 'overdue',
                        createdAt: new Date(), // Current time for overdue items not linked to existing fees
                        loan: overdue.loan,
                        totalAmount: overdue.fees.total,
                        overdue: overdue.fees.total,
                        transactions: []
                    };
                    records.push(overdueRecord);
                }
            });

            // Sort by creation date
            return records.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        };

        const loadFees = rxMethod<string>(
            pipe(
                tap(() => patchState(store, { feesLoading: true })),
                switchMap((patronPid) => {
                    const queryFees = patronTransactionApi.getFees(patronPid, 'open', 1, RecordService.MAX_REST_RESULTS_SIZE);
                    const queryOverdue = patronApi.getOverduePreviewByPatronPid(patronPid);
                    return forkJoin([queryFees, queryOverdue]).pipe(
                        tap(([feesResponse, overdueResponse]: [Record, overdueFee[]]) => {
                            const processedFees = processFees(feesResponse, overdueResponse);
                            patchState(store, { fees: processedFees, feesLoading: false });
                        }),
                        catchError(() => {
                            patchState(store, { fees: [], feesLoading: false });
                            return of(null);
                        })
                    );
                })
            )
        );

        return {
            loadFees
        };
    }),
    withHooks((store, menuStore = inject(PatronProfileMenuStore)) => ({
        onInit: () => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, { currentPatronPid: patron.pid });
                store.loadFees(patron.pid);
            }
        },
        __patronEffect: effect(() => {
            const patron = menuStore.currentPatron();
            if (patron) {
                patchState(store, {
                    currentPatronPid: patron.pid,
                    fees: []
                });
                store.loadFees(patron.pid);
            }
        })
    }))
);
