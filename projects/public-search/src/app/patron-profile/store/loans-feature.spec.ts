// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { withLoansFeature } from './loans-feature';

type RenewalResponse = {
  end_date: string;
  extension_count: number;
  is_late: boolean;
  due_soon_date: string;
};

const LoansFeatureStore = signalStore(
  withState({ patronPid: 'patron-1' as string | null }),
  withLoansFeature()
);

describe('LoansFeature', () => {
  let store: InstanceType<typeof LoansFeatureStore>;
  const loanApiService = {
    getOnLoan: vi.fn(),
    canExtend: vi.fn(),
    renew: vi.fn(),
  };
  const spinner = {
    show: vi.fn(),
    hide: vi.fn(),
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
    store = TestBed.configureTestingModule({
      providers: [
        LoansFeatureStore,
        { provide: LoanApiService, useValue: loanApiService },
        { provide: NgxSpinnerService, useValue: spinner },
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

    store.loadLoans(1, 20).subscribe();

    expect(loanApiService.getOnLoan).toHaveBeenCalledWith('patron-1', 1, 20, undefined, 'duedate');
    expect(store.loans()).toEqual([loan]);
    expect(store.loansLoaded()).toBe(true);
  });

  it('stores can-extend results on the matching loan', () => {
    const result = { can: true, reasons: {} };
    loanApiService.getOnLoan.mockReturnValue(of({ hits: { hits: [loan], total: { value: 1 } } }));
    loanApiService.canExtend.mockReturnValue(of(result));
    store.loadLoans(1, 20).subscribe();

    store.canExtendLoan('loan-1').subscribe(response => expect(response).toEqual(result));

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
    loanApiService.canExtend.mockReturnValue(of({ can: false, reasons: {} }));
    store.loadLoans(1, 20).subscribe();

    store.renewLoan('loan-1').subscribe();

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
    expect(store.loans()[1]).toEqual(otherLoan);
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
    loanApiService.canExtend.mockReturnValue(of({ can: false, reasons: {} }));
    store.loadLoans(1, 20).subscribe();

    store.renewAllLoans();

    expect(spinner.show).toHaveBeenCalledWith('renew-all-loans');
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

    expect(spinner.hide).toHaveBeenCalledWith('renew-all-loans');
    expect(store.renewingLoans()).toBe(false);
    expect(loanApiService.renew).toHaveBeenCalledTimes(2);
    expect(loanApiService.renew).toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-1' }));
    expect(loanApiService.renew).toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-2' }));
    expect(loanApiService.renew).not.toHaveBeenCalledWith(expect.objectContaining({ pid: 'loan-3' }));
  });

});
