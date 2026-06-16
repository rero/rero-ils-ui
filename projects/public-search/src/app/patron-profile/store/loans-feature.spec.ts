// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { withLoansFeature } from './loans-feature';

type RenewalResponse = {
  end_date: string;
  extension_count: number;
  is_late: boolean;
  due_soon_date: string;
};

const LoansFeatureStore = signalStore(
  withProps(() => ({ patronPid: signal<string | null>(null) })),
  withMethods(store => ({
    setPatronPid(patronPid: string | null): void {
      store.patronPid.set(patronPid);
    },
  })),
  withLoansFeature()
);

describe('LoansFeature', () => {
  let store: InstanceType<typeof LoansFeatureStore>;
  const loanApiService = {
    getOnLoan: vi.fn(),
    canExtend: vi.fn(),
    renew: vi.fn(),
  };
  const translateService = {
    instant: vi.fn((value: string) => value),
  };
  const messageService = {
    add: vi.fn(),
  };

  const loan = {
    metadata: {
      pid: 'loan-1',
      item: { pid: 'item-1', location: { pid: 'location-1' } },
      end_date: '2026-07-02',
      overdue: 2,
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    loanApiService.canExtend.mockReturnValue(of(undefined));
    store = TestBed.configureTestingModule({
      providers: [
        LoansFeatureStore,
        { provide: LoanApiService, useValue: loanApiService },
        { provide: TranslateService, useValue: translateService },
        { provide: MessageService, useValue: messageService },
      ],
    }).inject(LoansFeatureStore);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('changes the loan sort criteria', () => {
    store.changeLoansSortCriteria('-duedate');

    expect(store.loansSortCriteria()).toBe('-duedate');
  });

  it('loads the first page of loans into store state', () => {
    loanApiService.getOnLoan.mockReturnValue(of({ hits: { hits: [loan], total: { value: 1 } } }));

    store.setPatronPid('patron-1');
    TestBed.tick();

    expect(loanApiService.getOnLoan).toHaveBeenCalledWith('patron-1', 1, 9999, undefined, 'duedate');
    expect(store.loans()).toEqual([loan]);
    expect(store.loansLoaded()).toBe(true);
  });

  it('stores can-extend results on the matching loan', () => {
    const result = { can: true, reasons: {} };
    loanApiService.getOnLoan.mockReturnValue(of({ hits: { hits: [loan], total: { value: 1 } } }));
    loanApiService.canExtend.mockReturnValue(of(result));

    store.setPatronPid('patron-1');
    TestBed.tick();

    expect(loanApiService.canExtend).toHaveBeenCalledWith('loan-1');
    expect(store.loans()[0].canExtend).toEqual(result);
    expect(store.renewableLoans()).toEqual([store.loans()[0]]);
  });

  it('updates the matching loan after a successful renewal', () => {
    const otherLoan = { metadata: { pid: 'loan-2', overdue: 1 } };
    loanApiService.getOnLoan.mockReturnValue(of({ hits: { hits: [loan, otherLoan], total: { value: 2 } } }));
    loanApiService.renew.mockReturnValue(of({
      end_date: '2026-07-01',
      extension_count: 2,
      is_late: false,
      due_soon_date: '2026-06-30',
    }));
    loanApiService.canExtend.mockImplementation((loanPid: string) => of(
      loanPid === 'loan-1' ? { can: false, reasons: {} } : undefined
    ));
    store.setPatronPid('patron-1');
    TestBed.tick();

    store.renewLoan('loan-1');

    expect(loanApiService.renew).toHaveBeenCalledWith({
      pid: 'loan-1',
      item_pid: 'item-1',
      transaction_location_pid: 'location-1',
      transaction_user_pid: 'patron-1',
    });
    expect(store.loans()[0].metadata).toMatchObject({
      pid: 'loan-1',
      end_date: '2026-07-01',
      extension_count: 2,
      is_late: false,
      due_soon_date: '2026-06-30',
    });
    expect(store.loans()[0].metadata).not.toHaveProperty('overdue');
    expect(store.loans()[0].renewed).toBe(true);
    expect(loanApiService.canExtend).toHaveBeenCalledWith('loan-1');
    expect(store.loans()[0].canExtend).toEqual({ can: false, reasons: {} });
    expect(store.renewableLoans()).toEqual([]);
    expect(store.renewingLoans()).toBe(false);
    expect(store.renewingLoanPid()).toBeNull();
    expect(store.loans()[1]).toEqual(otherLoan);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'The item has been renewed.',
      life: CONFIG.MESSAGE_LIFE,
    });
  });

  it('handles an error while renewing one loan', () => {
    loanApiService.getOnLoan.mockReturnValue(of({ hits: { hits: [loan], total: { value: 1 } } }));
    loanApiService.renew.mockReturnValue(throwError(() => new Error('Renewal failed')));
    store.setPatronPid('patron-1');
    TestBed.tick();

    store.renewLoan('loan-1');

    expect(store.renewingLoans()).toBe(false);
    expect(store.renewingLoanPid()).toBeNull();
    expect(store.loans()[0].renewed).toBeUndefined();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error during the renewal of the item.',
      closable: true,
    });
  });

  it('renews every stored loan that can be extended sequentially', () => {
    const renewableLoan = {
      metadata: {
        pid: 'loan-2',
        item: { pid: 'item-2', location: { pid: 'location-2' } },
        end_date: '2026-07-01',
      },
      canExtend: { can: true, reasons: {} },
    };
    const nonRenewableLoan = {
      metadata: {
        pid: 'loan-3',
        item: { pid: 'item-3', location: { pid: 'location-3' } },
      },
      canExtend: { can: false, reasons: { blocked: 'Blocked' } },
    };
    loanApiService.getOnLoan.mockReturnValue(of({
      hits: { hits: [{ ...loan, canExtend: { can: true, reasons: {} } }, renewableLoan, nonRenewableLoan], total: { value: 3 } },
    }));
    const firstRenewal = new Subject<RenewalResponse>();
    const secondRenewal = new Subject<RenewalResponse>();
    loanApiService.renew
      .mockReturnValueOnce(firstRenewal)
      .mockReturnValueOnce(secondRenewal);
    loanApiService.canExtend.mockImplementation((loanPid: string) => of(
      loanPid === 'loan-3'
        ? { can: false, reasons: { blocked: 'Blocked' } }
        : { can: true, reasons: {} }
    ));
    store.setPatronPid('patron-1');
    TestBed.tick();

    store.renewAllLoans();
    store.renewAllLoans();

    expect(loanApiService.renew).toHaveBeenCalledTimes(1);
    expect(loanApiService.renew).toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-2' }));
    expect(store.renewingLoans()).toBe(true);

    firstRenewal.next({
      end_date: '2026-07-01',
      extension_count: 1,
      is_late: false,
      due_soon_date: '2026-06-30',
    });
    firstRenewal.complete();

    expect(loanApiService.renew).toHaveBeenCalledTimes(2);
    expect(loanApiService.renew).toHaveBeenNthCalledWith(2, expect.objectContaining({ pid: 'loan-1' }));

    secondRenewal.next({
      end_date: '2026-07-02',
      extension_count: 1,
      is_late: false,
      due_soon_date: '2026-07-01',
    });
    secondRenewal.complete();

    expect(store.renewingLoans()).toBe(false);
    expect(loanApiService.renew).toHaveBeenCalledTimes(2);
    expect(loanApiService.renew).toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-1' }));
    expect(loanApiService.renew).toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-2' }));
    expect(loanApiService.renew).not.toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-3' }));
    expect(loanApiService.getOnLoan).toHaveBeenCalledTimes(2);
  });

  it('continues renewing the remaining loans when one renewal fails', () => {
    const secondLoan = {
      metadata: {
        pid: 'loan-2',
        item: { pid: 'item-2', location: { pid: 'location-2' } },
        end_date: '2026-07-03',
      },
      canExtend: { can: true, reasons: {} },
    };
    loanApiService.getOnLoan.mockReturnValue(of({
      hits: {
        hits: [
          { ...loan, canExtend: { can: true, reasons: {} } },
          secondLoan,
        ],
        total: { value: 2 },
      },
    }));
    loanApiService.canExtend.mockReturnValue(of({ can: true, reasons: {} }));
    loanApiService.renew
      .mockReturnValueOnce(throwError(() => new Error('Renewal failed')))
      .mockReturnValueOnce(of({
        end_date: '2026-08-03',
        extension_count: 1,
        is_late: false,
        due_soon_date: '2026-08-01',
      }));
    store.setPatronPid('patron-1');
    TestBed.tick();

    store.renewAllLoans();

    expect(loanApiService.renew).toHaveBeenCalledTimes(2);
    expect(loanApiService.renew).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ pid: 'loan-1' })
    );
    expect(loanApiService.renew).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ pid: 'loan-2' })
    );
  });

});
