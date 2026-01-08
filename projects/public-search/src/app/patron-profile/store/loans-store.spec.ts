import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoansStore } from './loans-store';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import { patchState } from '@ngrx/signals';

describe('LoansStore', () => {
  let store: any;
  let mockLoanApi: any;
  let mockMenuStore: any;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;

  const mockLoans = [
    {
      metadata: {
        pid: 'loan1',
        item: { pid: 'item1', location: { pid: 'loc1' } },
        end_date: '2025-01-01',
        extension_count: 0,
        is_late: false,
        due_soon_date: null,
      },
      canExtend: { can: true },
    } as any,
    {
      metadata: {
        pid: 'loan2',
        item: { pid: 'item2', location: { pid: 'loc2' } },
        end_date: '2025-01-15',
        extension_count: 1,
        is_late: false,
        due_soon_date: null,
      },
      canExtend: { can: false },
    } as any,
  ];

  const mockRecord: Record = {
    hits: { total: { value: 2 }, hits: mockLoans },
    aggregations: {},
    timed_out: false,
    took: 0,
  } as any;

  const mockRenewedLoan = {
    pid: 'loan1',
    end_date: '2025-02-01',
    extension_count: 1,
    is_late: false,
    due_soon_date: null,
  };

  beforeEach(() => {
    mockLoanApi = jasmine.createSpyObj('LoanApiService', ['getOnLoan', 'canExtend', 'renew']);
    mockLoanApi.getOnLoan.and.returnValue(of(mockRecord));
    // Return different canExtend values for each loan
    mockLoanApi.canExtend.and.callFake((pid: string) => {
      if (pid === 'loan1') {
        return of({ can: true });
      } else {
        return of({ can: false });
      }
    });
    mockLoanApi.renew.and.returnValue(of(mockRenewedLoan));

    // Mock with null patron to prevent auto-init from running
    mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
      currentPatron: () => null,
    });

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockTranslate = jasmine.createSpyObj('TranslateService', ['instant']);
    mockTranslate.instant.and.callFake((s: string) => s);

    TestBed.configureTestingModule({
      providers: [
        LoansStore,
        { provide: LoanApiService, useValue: mockLoanApi },
        { provide: PatronProfileMenuStore, useValue: mockMenuStore },
        { provide: MessageService, useValue: mockMessageService },
        { provide: TranslateService, useValue: mockTranslate },
      ],
    });
    store = TestBed.inject(LoansStore);
  });

  describe('Store initialization', () => {
    it('should create the store with initial state', () => {
      expect(store).toBeTruthy();
      expect(store.loans()).toEqual([]);
      expect(store.loansLoading()).toBe(false);
      expect(store.renewInProgress()).toBe(false);
    });
  });

  describe('loadLoans', () => {
    beforeEach(() => {
      // Set a patron PID for loading
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should load loans for current patron', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        expect(store.loans().length).toBe(2);
        expect(store.loans()[0].metadata.pid).toBe('loan1');
        expect(store.loans()[1].metadata.pid).toBe('loan2');
        expect(mockLoanApi.getOnLoan).toHaveBeenCalledWith('patron-1', 1, 9999, undefined, 'duedate');
        done();
      }, 200);
    });

    it('should set loansLoading to true during loading', (done) => {
      store.loadLoans('duedate');

      // Check immediately that loading is true
      setTimeout(() => {
        expect(store.loansLoading()).toBe(false); // Should be false after completion
        done();
      }, 200);
    });

    it('should handle empty loan results', (done) => {
      const emptyRecord: Record = {
        hits: { total: { value: 0 }, hits: [] },
        aggregations: {},
        timed_out: false,
        took: 0,
      } as any;
      mockLoanApi.getOnLoan.and.returnValue(of(emptyRecord));

      store.loadLoans('duedate');

      setTimeout(() => {
        expect(store.loans().length).toBe(0);
        done();
      }, 200);
    });

    it('should update loan permissions after loading', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        expect(mockLoanApi.canExtend).toHaveBeenCalled();
        done();
      }, 200);
    });
  });

  describe('renewableLoans computed', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should return only renewable loans', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        const renewable = store.renewableLoans();
        expect(renewable.length).toBe(1);
        expect(renewable[0].metadata.pid).toBe('loan1');
        done();
      }, 200);
    });
  });

  describe('renewLoan', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should renew a single loan successfully', (done) => {
      // First load loans
      store.loadLoans('duedate');

      setTimeout(() => {
        const loanToRenew = store.loans()[0];
        store.renewLoan(loanToRenew);

        setTimeout(() => {
          expect(mockLoanApi.renew).toHaveBeenCalledWith({
            pid: 'loan1',
            item_pid: 'item1',
            transaction_location_pid: 'loc1',
            transaction_user_pid: 'patron-1',
          });
          expect(mockMessageService.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              severity: 'success',
              summary: 'Success',
              detail: 'The item has been renewed.',
            })
          );
          done();
        }, 200);
      }, 200);
    });

    it('should update loan data after successful renewal', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        const loanToRenew = store.loans()[0];
        store.renewLoan(loanToRenew);

        setTimeout(() => {
          const updatedLoan = store.loans().find((l: any) => l.metadata.pid === 'loan1');
          expect(updatedLoan.metadata.end_date).toBe('2025-02-01');
          expect(updatedLoan.metadata.extension_count).toBe(1);
          expect(updatedLoan.actionSuccess).toBe(true);
          done();
        }, 200);
      }, 200);
    });

    it('should handle renewal error', (done) => {
      mockLoanApi.renew.and.returnValue(of(undefined));
      store.loadLoans('duedate');

      setTimeout(() => {
        const loanToRenew = store.loans()[0];
        store.renewLoan(loanToRenew);

        setTimeout(() => {
          expect(mockMessageService.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              severity: 'error',
              summary: 'Error',
              detail: 'Error during the renewal of the item.',
            })
          );
          done();
        }, 200);
      }, 200);
    });

    it('should set renewInProgress during renewal', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        const loanToRenew = store.loans()[0];
        store.renewLoan(loanToRenew);

        setTimeout(() => {
          expect(store.renewInProgress()).toBe(false); // Should be false after completion
          done();
        }, 200);
      }, 200);
    });
  });

  describe('renewLoans (renew all)', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should renew all renewable loans', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        store.renewLoans();

        setTimeout(() => {
          // Should only renew the one renewable loan
          expect(mockLoanApi.renew).toHaveBeenCalledTimes(1);
          expect(mockLoanApi.renew).toHaveBeenCalledWith(
            jasmine.objectContaining({
              pid: 'loan1',
            })
          );
          done();
        }, 300);
      }, 200);
    });

    it('should update all renewed loans', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        store.renewLoans();

        setTimeout(() => {
          const renewedLoan = store.loans().find((l: any) => l.metadata.pid === 'loan1');
          expect(renewedLoan.metadata.end_date).toBe('2025-02-01');
          expect(renewedLoan.actionSuccess).toBe(true);
          done();
        }, 300);
      }, 200);
    });

    it('should handle partial renewal failures', (done) => {
      // Mock multiple renewable loans
      const multipleRenewableLoans = [
        { ...mockLoans[0], canExtend: { can: true } },
        { ...mockLoans[1], canExtend: { can: true } },
      ];
      const multiRecord: Record = {
        hits: { total: { value: 2 }, hits: multipleRenewableLoans },
        aggregations: {},
        timed_out: false,
        took: 0,
      } as any;
      mockLoanApi.getOnLoan.and.returnValue(of(multiRecord));
      // Override canExtend to return true for both loans
      mockLoanApi.canExtend.and.returnValue(of({ can: true }));
      mockLoanApi.renew.and.returnValues(of(mockRenewedLoan), of(undefined));

      store.loadLoans('duedate');

      setTimeout(() => {
        store.renewLoans();

        setTimeout(() => {
          expect(mockLoanApi.renew).toHaveBeenCalledTimes(2);
          done();
        }, 300);
      }, 200);
    });
  });

  describe('updateLoanPermissions', () => {
    beforeEach(() => {
      patchState(store, { currentPatronPid: 'patron-1' });
    });

    it('should update canExtend for all loans', (done) => {
      store.loadLoans('duedate');

      setTimeout(() => {
        expect(mockLoanApi.canExtend).toHaveBeenCalledWith('loan1');
        expect(mockLoanApi.canExtend).toHaveBeenCalledWith('loan2');
        done();
      }, 200);
    });

    it('should update loan objects with canExtend responses', (done) => {
      mockLoanApi.canExtend.and.returnValues(
        of({ can: true, reasons: [] }),
        of({ can: false, reasons: ['max_renewals'] })
      );

      store.loadLoans('duedate');

      setTimeout(() => {
        const loans = store.loans();
        expect(loans[0].canExtend.can).toBeDefined();
        expect(loans[1].canExtend.can).toBeDefined();
        done();
      }, 200);
    });
  });
});
