import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RequestsStore } from './requests-store';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import { patchState } from '@ngrx/signals';

describe('RequestsStore', () => {
  let store: any;
  let mockLoanApi: any;
  let mockMenuStore: any;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;

  const mockRequests = [
    { metadata: { pid: 'req1', item: { location: { pid: 'loc1' } } } } as any,
    { metadata: { pid: 'req2', item: { location: { pid: 'loc2' } } } } as any,
  ];

  const mockRecord: Record = {
    hits: { total: { value: 5 }, hits: mockRequests },
    aggregations: {},
    timed_out: false,
    took: 0,
  } as any;

  const mockCancelResult = {
    pid: 'req1',
  };

  beforeEach(() => {
    mockLoanApi = jasmine.createSpyObj('LoanApiService', ['getRequest', 'cancel']);
    mockLoanApi.getRequest.and.returnValue(of(mockRecord));
    mockLoanApi.cancel.and.returnValue(of(mockCancelResult));

    // Mock with null patron to prevent auto-init
    mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
      currentPatron: () => null,
    });

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockTranslate = jasmine.createSpyObj('TranslateService', ['instant']);
    mockTranslate.instant.and.callFake((s: string) => s);

    TestBed.configureTestingModule({
      providers: [
        RequestsStore,
        { provide: LoanApiService, useValue: mockLoanApi },
        { provide: PatronProfileMenuStore, useValue: mockMenuStore },
        { provide: MessageService, useValue: mockMessageService },
        { provide: TranslateService, useValue: mockTranslate },
      ],
    });

    store = TestBed.inject(RequestsStore);
  });

  describe('Store initialization', () => {
    it('should create the store with initial state', () => {
      expect(store).toBeTruthy();
    });

    it('should have empty requests array initially', () => {
      expect(store.requests()).toEqual([]);
    });

    it('should have requestsLoading false initially', () => {
      expect(store.requestsLoading()).toBe(false);
    });

    it('should have cancelInProgress false initially', () => {
      expect(store.cancelInProgress()).toBe(false);
    });
  });

  describe('loadRequests', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should load requests for patron (page 1)', (done) => {
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.requests().length).toBe(2);
        expect(store.requests()[0].metadata.pid).toBe('req1');
        expect(store.total()).toBe(5);
        expect(store.page()).toBe(1);
        expect(mockLoanApi.getRequest).toHaveBeenCalledWith('patron-1', 1, 10);
        done();
      }, 100);
    });

    it('should append requests when loading more (page 2+)', (done) => {
      // Load page 1 first
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.requests().length).toBe(2);
        expect(store.page()).toBe(1);

        // Load page 2
        const moreRequests = [
          { metadata: { pid: 'req3', item: { location: { pid: 'loc3' } } } } as any,
        ];
        const moreRecord: Record = {
          hits: { total: { value: 5 }, hits: moreRequests },
          aggregations: {},
          timed_out: false,
          took: 0,
        } as any;
        mockLoanApi.getRequest.and.returnValue(of(moreRecord));

        store.loadRequests({ patronPid: 'patron-1', page: 2 });

        setTimeout(() => {
          expect(store.requests().length).toBe(3);
          expect(store.requests()[2].metadata.pid).toBe('req3');
          expect(store.page()).toBe(2);
          done();
        }, 100);
      }, 100);
    });

    it('should set total count correctly', (done) => {
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.total()).toBe(5);
        done();
      }, 100);
    });

    it('should handle API errors', (done) => {
      mockLoanApi.getRequest.and.returnValue(throwError(() => new Error('API Error')));

      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.requests()).toEqual([]);
        expect(store.requestsLoading()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('cancelRequest', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
      // Load some requests first
      store.loadRequests({ patronPid: 'patron-1', page: 1 });
    });

    it('should cancel request successfully', (done) => {
      setTimeout(() => {
        const initialCount = store.requests().length;

        store.cancelRequest({
          pid: 'req1',
          transactionLocationPid: 'loc1',
          transactionUserPid: 'patron-1',
        });

        setTimeout(() => {
          expect(mockLoanApi.cancel).toHaveBeenCalledWith({
            pid: 'req1',
            transaction_location_pid: 'loc1',
            transaction_user_pid: 'patron-1',
          });
          expect(mockMessageService.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              severity: 'success',
              summary: 'Success',
              detail: 'The request has been cancelled.',
            })
          );
          done();
        }, 100);
      }, 100);
    });

    it('should remove request from list after cancel', (done) => {
      setTimeout(() => {
        expect(store.requests().length).toBe(2);

        store.cancelRequest({
          pid: 'req1',
          transactionLocationPid: 'loc1',
          transactionUserPid: 'patron-1',
        });

        setTimeout(() => {
          expect(store.requests().length).toBe(1);
          expect(store.requests()[0].metadata.pid).toBe('req2');
          expect(store.total()).toBe(4); // Decremented
          done();
        }, 100);
      }, 100);
    });

    it('should show error message on cancel failure', (done) => {
      mockLoanApi.cancel.and.returnValue(of(undefined));

      setTimeout(() => {
        store.cancelRequest({
          pid: 'req1',
          transactionLocationPid: 'loc1',
          transactionUserPid: 'patron-1',
        });

        setTimeout(() => {
          expect(mockMessageService.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              severity: 'error',
              summary: 'Error',
              detail: 'Error during the cancellation of the request.',
            })
          );
          expect(store.cancelInProgress()).toBe(false);
          done();
        }, 100);
      }, 100);
    });
  });

  describe('hasMore computed', () => {
    it('should return true when more requests available', (done) => {
      patchState(store, { currentPatronPid: 'patron-1' });
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

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
        { metadata: { pid: 'req3' } },
        { metadata: { pid: 'req4' } },
        { metadata: { pid: 'req5' } },
      ] as any[];
      const fullRecord: Record = {
        hits: { total: { value: 5 }, hits: allRequests },
        aggregations: {},
        timed_out: false,
        took: 0,
      } as any;
      mockLoanApi.getRequest.and.returnValue(of(fullRecord));

      patchState(store, { currentPatronPid: 'patron-1' });
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        // Loaded 5 out of 5 total
        expect(store.hasMore()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('loadMore', () => {
    it('should load next page when hasMore is true', (done) => {
      patchState(store, { currentPatronPid: 'patron-1' });
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.page()).toBe(1);
        expect(store.hasMore()).toBe(true);

        store.loadMore();

        setTimeout(() => {
          expect(mockLoanApi.getRequest).toHaveBeenCalledWith('patron-1', 2, 10);
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
      mockLoanApi.getRequest.and.returnValue(of(exactRecord));

      patchState(store, { currentPatronPid: 'patron-1' });
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(store.hasMore()).toBe(false);
        mockLoanApi.getRequest.calls.reset();
        store.loadMore();

        setTimeout(() => {
          expect(mockLoanApi.getRequest).not.toHaveBeenCalled();
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Patron change reaction', () => {
    it('should reload requests when patron changes', (done) => {
      patchState(store, { currentPatronPid: 'patron-1' });
      store.loadRequests({ patronPid: 'patron-1', page: 1 });

      setTimeout(() => {
        expect(mockLoanApi.getRequest).toHaveBeenCalledWith('patron-1', 1, 10);

        // Change patron
        store.loadRequests({ patronPid: 'patron-2', page: 1 });

        setTimeout(() => {
          expect(mockLoanApi.getRequest).toHaveBeenCalledWith('patron-2', 1, 10);
          done();
        }, 100);
      }, 100);
    });

    it('should reset pagination on patron change', (done) => {
      patchState(store, { currentPatronPid: 'patron-1', page: 3, requests: mockRequests });

      // Simulate patron change by resetting and loading
      patchState(store, { requests: [], page: 0, total: 0 });
      store.loadRequests({ patronPid: 'patron-2', page: 1 });

      setTimeout(() => {
        expect(store.page()).toBe(1);
        expect(store.requests().length).toBe(2);
        done();
      }, 100);
    });
  });
});
