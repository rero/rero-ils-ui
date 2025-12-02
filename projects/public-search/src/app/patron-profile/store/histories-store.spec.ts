import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HistoriesStore } from './histories-store';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { Record } from '@rero/ng-core';
import { patchState } from '@ngrx/signals';

describe('HistoriesStore', () => {
    let store: any;
    let mockOperationLogsApi: any;
    let mockMenuStore: any;

    const mockHistory = [
        { metadata: { pid: 'hist1', document: { title: 'Book 1' } } } as any,
        { metadata: { pid: 'hist2', document: { title: 'Book 2' } } } as any,
    ];

    const mockRecord: Record = {
        hits: { total: { value: 5 }, hits: mockHistory },
        aggregations: {},
        timed_out: false,
        took: 0,
    } as any;

    beforeEach(() => {
        mockOperationLogsApi = jasmine.createSpyObj('OperationLogsApiService', ['getHistory']);
        mockOperationLogsApi.getHistory.and.returnValue(of(mockRecord));

        // Mock with null patron to prevent auto-init
        mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
            currentPatron: () => null,
        });

        TestBed.configureTestingModule({
            providers: [
                HistoriesStore,
                { provide: OperationLogsApiService, useValue: mockOperationLogsApi },
                { provide: PatronProfileMenuStore, useValue: mockMenuStore },
            ],
        });

        store = TestBed.inject(HistoriesStore);
    });

    describe('Store initialization', () => {
        it('should create the store with initial state', () => {
            expect(store).toBeTruthy();
        });

        it('should have empty history array initially', () => {
            expect(store.history()).toEqual([]);
        });

        it('should have historyLoading false initially', () => {
            expect(store.historyLoading()).toBe(false);
        });
    });

    describe('loadHistory', () => {
        beforeEach(() => {
            patchState(store, { currentPatronPid: 'patron-1' });
        });

        it('should load history for patron (page 1)', (done) => {
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.history().length).toBe(2);
                expect(store.history()[0].metadata.pid).toBe('hist1');
                expect(store.total()).toBe(5);
                expect(store.page()).toBe(1);
                expect(mockOperationLogsApi.getHistory).toHaveBeenCalledWith(
                    'patron-1', 1, 10
                );
                done();
            }, 100);
        });

        it('should append history when loading more (page 2+)', (done) => {
            // Load page 1 first
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.history().length).toBe(2);
                expect(store.page()).toBe(1);

                // Load page 2
                const moreHistory = [
                    { metadata: { pid: 'hist3', document: { title: 'Book 3' } } } as any,
                ];
                const moreRecord: Record = {
                    hits: { total: { value: 5 }, hits: moreHistory },
                    aggregations: {},
                    timed_out: false,
                    took: 0,
                } as any;
                mockOperationLogsApi.getHistory.and.returnValue(of(moreRecord));

                store.loadHistory({ patronPid: 'patron-1', page: 2 });

                setTimeout(() => {
                    expect(store.history().length).toBe(3);
                    expect(store.history()[2].metadata.pid).toBe('hist3');
                    expect(store.page()).toBe(2);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle API errors', (done) => {
            mockOperationLogsApi.getHistory.and.returnValue(throwError(() => new Error('API Error')));

            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.history()).toEqual([]);
                expect(store.historyLoading()).toBe(false);
                done();
            }, 100);
        });
    });

    describe('hasMore computed', () => {
        it('should return true when more history available', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                // Loaded 2 out of 5 total
                expect(store.hasMore()).toBe(true);
                done();
            }, 100);
        });

        it('should return false when all history loaded', (done) => {
            const allHistory = [
                { metadata: { pid: 'hist1' } },
                { metadata: { pid: 'hist2' } },
            ] as any[];
            const fullRecord: Record = {
                hits: { total: { value: 2 }, hits: allHistory },
                aggregations: {},
                timed_out: false,
                took: 0,
            } as any;
            mockOperationLogsApi.getHistory.and.returnValue(of(fullRecord));

            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                // Loaded 2 out of 2 total
                expect(store.hasMore()).toBe(false);
                done();
            }, 100);
        });
    });

    describe('loadMore', () => {
        it('should load next page when hasMore is true', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.page()).toBe(1);
                expect(store.hasMore()).toBe(true);

                store.loadMore();

                setTimeout(() => {
                    expect(mockOperationLogsApi.getHistory).toHaveBeenCalledWith(
                        'patron-1', 2, 10
                    );
                    done();
                }, 100);
            }, 100);
        });

        it('should not load when hasMore is false', (done) => {
            // Use mock data where total matches history length
            const exactHistory = [
                { metadata: { pid: 'hist1' } },
                { metadata: { pid: 'hist2' } },
            ] as any[];
            const exactRecord: Record = {
                hits: { total: { value: 2 }, hits: exactHistory },
                aggregations: {},
                timed_out: false,
                took: 0,
            } as any;
            mockOperationLogsApi.getHistory.and.returnValue(of(exactRecord));

            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.hasMore()).toBe(false);
                mockOperationLogsApi.getHistory.calls.reset();
                store.loadMore();

                setTimeout(() => {
                    expect(mockOperationLogsApi.getHistory).not.toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Patron change reaction', () => {
        it('should reload history when patron changes', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadHistory({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(mockOperationLogsApi.getHistory).toHaveBeenCalledWith(
                    'patron-1', 1, 10
                );

                // Change patron
                store.loadHistory({ patronPid: 'patron-2', page: 1 });

                setTimeout(() => {
                    expect(mockOperationLogsApi.getHistory).toHaveBeenCalledWith(
                        'patron-2', 1, 10
                    );
                    done();
                }, 100);
            }, 100);
        });

        it('should reset pagination on patron change', (done) => {
            patchState(store, { currentPatronPid: 'patron-1', page: 3, history: mockHistory });

            // Simulate patron change by resetting and loading
            patchState(store, { history: [], page: 0, total: 0 });
            store.loadHistory({ patronPid: 'patron-2', page: 1 });

            setTimeout(() => {
                expect(store.page()).toBe(1);
                expect(store.history().length).toBe(2);
                done();
            }, 100);
        });
    });
});
