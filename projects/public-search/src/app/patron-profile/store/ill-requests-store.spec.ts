import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IllRequestsStore } from './ill-requests-store';
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { Record } from '@rero/ng-core';
import { patchState } from '@ngrx/signals';
import { BaseApi } from '@rero/shared';

describe('IllRequestsStore', () => {
    let store: any;
    let mockIllRequestApi: any;
    let mockMenuStore: any;

    const mockRequests = [
        { metadata: { pid: 'req1', document: { title: 'Book 1' } } } as any,
        { metadata: { pid: 'req2', document: { title: 'Book 2' } } } as any,
    ];

    const mockRecord: Record = {
        hits: { total: { value: 5 }, hits: mockRequests },
        aggregations: {},
        timed_out: false,
        took: 0,
    } as any;

    beforeEach(() => {
        mockIllRequestApi = jasmine.createSpyObj('IllRequestApiService', ['getPublicIllRequest']);
        mockIllRequestApi.getPublicIllRequest.and.returnValue(of(mockRecord));

        // Mock with null patron to prevent auto-init
        mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
            currentPatron: () => null,
        });

        TestBed.configureTestingModule({
            providers: [
                IllRequestsStore,
                { provide: IllRequestApiService, useValue: mockIllRequestApi },
                { provide: PatronProfileMenuStore, useValue: mockMenuStore },
            ],
        });

        store = TestBed.inject(IllRequestsStore);
    });

    describe('Store initialization', () => {
        it('should create the store with initial state', () => {
            expect(store).toBeTruthy();
        });

        it('should have empty requests array initially', () => {
            expect(store.illRequests()).toEqual([]);
        });

        it('should have illRequestsLoading false initially', () => {
            expect(store.illRequestsLoading()).toBe(false);
        });
    });

    describe('loadIllRequests', () => {
        beforeEach(() => {
            patchState(store, { currentPatronPid: 'patron-1' });
        });

        it('should load requests for patron (page 1)', (done) => {
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.illRequests().length).toBe(2);
                expect(store.illRequests()[0].metadata.pid).toBe('req1');
                expect(store.total()).toBe(5);
                expect(store.page()).toBe(1);
                expect(mockIllRequestApi.getPublicIllRequest).toHaveBeenCalledWith(
                    'patron-1', 1, 10, BaseApi.reroJsonheaders, '-created', { remove_archived: '1' }
                );
                done();
            }, 100);
        });

        it('should append requests when loading more (page 2+)', (done) => {
            // Load page 1 first
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.illRequests().length).toBe(2);
                expect(store.page()).toBe(1);

                // Load page 2
                const moreRequests = [
                    { metadata: { pid: 'req3', document: { title: 'Book 3' } } } as any,
                ];
                const moreRecord: Record = {
                    hits: { total: { value: 5 }, hits: moreRequests },
                    aggregations: {},
                    timed_out: false,
                    took: 0,
                } as any;
                mockIllRequestApi.getPublicIllRequest.and.returnValue(of(moreRecord));

                store.loadIllRequests({ patronPid: 'patron-1', page: 2 });

                setTimeout(() => {
                    expect(store.illRequests().length).toBe(3);
                    expect(store.illRequests()[2].metadata.pid).toBe('req3');
                    expect(store.page()).toBe(2);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle API errors', (done) => {
            mockIllRequestApi.getPublicIllRequest.and.returnValue(throwError(() => new Error('API Error')));

            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.illRequests()).toEqual([]);
                expect(store.illRequestsLoading()).toBe(false);
                done();
            }, 100);
        });
    });

    describe('hasMore computed', () => {
        it('should return true when more requests available', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                // Loaded 2 out of 5 total
                expect(store.hasMore()).toBe(true);
                done();
            }, 100);
        });

        it('should return false when all requests loaded', (done) => {
            const allRequests = [
                { metadata: { pid: 'req1' } },
                { metadata: { pid: 'req2' } },
            ] as any[];
            const fullRecord: Record = {
                hits: { total: { value: 2 }, hits: allRequests },
                aggregations: {},
                timed_out: false,
                took: 0,
            } as any;
            mockIllRequestApi.getPublicIllRequest.and.returnValue(of(fullRecord));

            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

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
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.page()).toBe(1);
                expect(store.hasMore()).toBe(true);

                store.loadMore();

                setTimeout(() => {
                    expect(mockIllRequestApi.getPublicIllRequest).toHaveBeenCalledWith(
                        'patron-1', 2, 10, BaseApi.reroJsonheaders, '-created', { remove_archived: '1' }
                    );
                    done();
                }, 100);
            }, 100);
        });

        it('should not load when hasMore is false', (done) => {
            // Use mock data where total matches requests length
            const exactRequests = [
                { metadata: { pid: 'req1' } },
                { metadata: { pid: 'req2' } },
            ] as any[];
            const exactRecord: Record = {
                hits: { total: { value: 2 }, hits: exactRequests },
                aggregations: {},
                timed_out: false,
                took: 0,
            } as any;
            mockIllRequestApi.getPublicIllRequest.and.returnValue(of(exactRecord));

            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(store.hasMore()).toBe(false);
                mockIllRequestApi.getPublicIllRequest.calls.reset();
                store.loadMore();

                setTimeout(() => {
                    expect(mockIllRequestApi.getPublicIllRequest).not.toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Patron change reaction', () => {
        it('should reload requests when patron changes', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadIllRequests({ patronPid: 'patron-1', page: 1 });

            setTimeout(() => {
                expect(mockIllRequestApi.getPublicIllRequest).toHaveBeenCalledWith(
                    'patron-1', 1, 10, BaseApi.reroJsonheaders, '-created', { remove_archived: '1' }
                );

                // Change patron
                store.loadIllRequests({ patronPid: 'patron-2', page: 1 });

                setTimeout(() => {
                    expect(mockIllRequestApi.getPublicIllRequest).toHaveBeenCalledWith(
                        'patron-2', 1, 10, BaseApi.reroJsonheaders, '-created', { remove_archived: '1' }
                    );
                    done();
                }, 100);
            }, 100);
        });

        it('should reset pagination on patron change', (done) => {
            patchState(store, { currentPatronPid: 'patron-1', page: 3, illRequests: mockRequests });

            // Simulate patron change by resetting and loading
            patchState(store, { illRequests: [], page: 0, total: 0 });
            store.loadIllRequests({ patronPid: 'patron-2', page: 1 });

            setTimeout(() => {
                expect(store.page()).toBe(1);
                expect(store.illRequests().length).toBe(2);
                done();
            }, 100);
        });
    });
});
