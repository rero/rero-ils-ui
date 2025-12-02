import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FeesStore } from './fees-store';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { Record, RecordService } from '@rero/ng-core';
import { patchState } from '@ngrx/signals';

describe('FeesStore', () => {
    let store: any;
    let mockPatronTransactionApi: any;
    let mockPatronApi: any;
    let mockMenuStore: any;

    const mockFeesRecord: Record = {
        hits: {
            total: { value: 2 },
            hits: [
                {
                    metadata: {
                        type: 'fee',
                        creation_date: '2023-01-01T10:00:00Z',
                        total_amount: 10,
                        loan: { pid: 'loan1' },
                        note: 'Late fee'
                    }
                },
                {
                    metadata: {
                        type: 'fee',
                        creation_date: '2023-01-02T10:00:00Z',
                        total_amount: 5,
                        loan: { pid: 'loan1' } // Same loan
                    }
                },
                {
                    metadata: {
                        type: 'manual',
                        creation_date: '2023-01-03T10:00:00Z',
                        total_amount: 20
                        // No loan
                    }
                }
            ]
        },
        aggregations: {},
        timed_out: false,
        took: 0
    } as any;

    const mockOverdueResponse = [
        {
            loan: { pid: 'loan1' },
            fees: { total: 2, steps: [] }
        },
        {
            loan: { pid: 'loan2' },
            fees: { total: 15, steps: [] }
        }
    ];

    beforeEach(() => {
        mockPatronTransactionApi = jasmine.createSpyObj('PatronTransactionApiService', ['getFees']);
        mockPatronApi = jasmine.createSpyObj('PatronApiService', ['getOverduePreviewByPatronPid']);

        // Mock with null patron to prevent auto-init
        mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
            currentPatron: () => null,
        });

        TestBed.configureTestingModule({
            providers: [
                FeesStore,
                { provide: PatronTransactionApiService, useValue: mockPatronTransactionApi },
                { provide: PatronApiService, useValue: mockPatronApi },
                { provide: PatronProfileMenuStore, useValue: mockMenuStore },
            ],
        });

        store = TestBed.inject(FeesStore);
    });

    describe('Store initialization', () => {
        it('should create the store with initial state', () => {
            expect(store).toBeTruthy();
            expect(store.fees()).toEqual([]);
            expect(store.feesLoading()).toBe(false);
        });
    });

    describe('loadFees', () => {
        beforeEach(() => {
            mockPatronTransactionApi.getFees.and.returnValue(of(mockFeesRecord));
            mockPatronApi.getOverduePreviewByPatronPid.and.returnValue(of(mockOverdueResponse));
        });

        it('should load and group fees correctly', (done) => {
            store.loadFees('patron-1');

            setTimeout(() => {
                expect(mockPatronTransactionApi.getFees).toHaveBeenCalledWith('patron-1', 'open', 1, RecordService.MAX_REST_RESULTS_SIZE);
                expect(mockPatronApi.getOverduePreviewByPatronPid).toHaveBeenCalledWith('patron-1');

                const fees = store.fees();
                expect(fees.length).toBe(3); // loan1 group, manual fee, loan2 overdue

                // Check Loan 1 group (2 transactions + 1 overdue)
                const loan1Fee = fees.find((f: any) => f.loan?.pid === 'loan1');
                expect(loan1Fee).toBeTruthy();
                expect(loan1Fee.totalAmount).toBe(10 + 5 + 2); // 17
                expect(loan1Fee.transactions.length).toBe(2);
                expect(loan1Fee.overdue).toBe(2);
                expect(loan1Fee.notes).toContain('Late fee');

                // Check Manual fee
                const manualFee = fees.find((f: any) => f.type === 'manual');
                expect(manualFee).toBeTruthy();
                expect(manualFee.totalAmount).toBe(20);
                expect(manualFee.loan).toBeUndefined();

                // Check Loan 2 overdue (only overdue, no transactions)
                const loan2Overdue = fees.find((f: any) => f.loan?.pid === 'loan2');
                expect(loan2Overdue).toBeTruthy();
                expect(loan2Overdue.totalAmount).toBe(15);
                expect(loan2Overdue.type).toBe('overdue');
                expect(loan2Overdue.transactions.length).toBe(0);

                done();
            }, 100);
        });

        it('should handle API errors', (done) => {
            mockPatronTransactionApi.getFees.and.returnValue(throwError(() => new Error('API Error')));
            mockPatronApi.getOverduePreviewByPatronPid.and.returnValue(of([]));

            store.loadFees('patron-1');

            setTimeout(() => {
                expect(store.fees()).toEqual([]);
                expect(store.feesLoading()).toBe(false);
                done();
            }, 100);
        });
    });

    describe('Patron change reaction', () => {
        it('should reload fees when patron changes', (done) => {
            mockPatronTransactionApi.getFees.and.returnValue(of(mockFeesRecord));
            mockPatronApi.getOverduePreviewByPatronPid.and.returnValue(of([]));

            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadFees('patron-1');

            setTimeout(() => {
                expect(mockPatronTransactionApi.getFees).toHaveBeenCalledWith('patron-1', jasmine.any(String), jasmine.any(Number), jasmine.any(Number));

                // Change patron
                store.loadFees('patron-2');

                setTimeout(() => {
                    expect(mockPatronTransactionApi.getFees).toHaveBeenCalledWith('patron-2', jasmine.any(String), jasmine.any(Number), jasmine.any(Number));
                    done();
                }, 100);
            }, 100);
        });
    });
});
