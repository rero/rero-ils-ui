// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PatronService } from '@app/admin/service/patron.service';
import { PatronTransactionService } from '../services/patron-transaction.service';
import { LoanFixedDateService } from '@app/admin/circulation/services/loan-fixed-date.service';
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { CirculationStore } from './circulation.store';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PATRON = { pid: 'p1', first_name: 'John', last_name: 'Doe' } as any;

const CIRCULATION_INFO = {
  statistics: {
    PENDING: 2,
    ITEM_IN_TRANSIT_FOR_PICKUP: 1,
    ITEM_AT_DESK: 3,
    ITEM_ON_LOAN: 5,
    ill_requests: 2,
  },
  messages: [{ type: 'warning', content: 'Test message' }],
};

const OVERDUE_PREVIEWS = [
  { fees: { steps: [], total: 10 }, loan: {} as any },
  { fees: { steps: [], total: 5 }, loan: {} as any },
];

function makeTransaction(amount: number, status = PatronTransactionStatus.OPEN): PatronTransaction {
  const t = new PatronTransaction();
  t.pid = `t${amount}`;
  t.total_amount = amount;
  t.status = status;
  return t;
}

const OPEN_TRANSACTIONS = [makeTransaction(8), makeTransaction(4)];
const DEFAULT_STATS = { feesEngaged: 0, fees: 0, overdueFees: 0, pending: 0, pickup: 0, loan: 0, ill: 0 };

// ─── Mocks ────────────────────────────────────────────────────────────────────

const patronServiceMock = {
  getPatron: vi.fn().mockReturnValue(of(PATRON)),
  getCirculationInformations: vi.fn().mockReturnValue(of(CIRCULATION_INFO)),
  getOverduePreview: vi.fn().mockReturnValue(of(OVERDUE_PREVIEWS)),
};

const patronTransactionServiceMock = {
  patronTransactionsByPatron: vi.fn().mockReturnValue(of(OPEN_TRANSACTIONS)),
};

const loanFixedDateServiceMock = {
  get: vi.fn().mockReturnValue(undefined),
  set: vi.fn(),
  remove: vi.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CirculationStore', () => {
  let store: InstanceType<typeof CirculationStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    patronServiceMock.getPatron.mockReturnValue(of(PATRON));
    patronServiceMock.getCirculationInformations.mockReturnValue(of(CIRCULATION_INFO));
    patronServiceMock.getOverduePreview.mockReturnValue(of(OVERDUE_PREVIEWS));
    patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of(OPEN_TRANSACTIONS));

    TestBed.configureTestingModule({
      providers: [
        CirculationStore,
        { provide: PatronService, useValue: patronServiceMock },
        { provide: PatronTransactionService, useValue: patronTransactionServiceMock },
        { provide: LoanFixedDateService, useValue: loanFixedDateServiceMock },
      ],
    });
    store = TestBed.inject(CirculationStore);
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('should have patron undefined', () => {
      expect(store.patron()).toBeUndefined();
    });

    it('should have all statistics at 0', () => {
      expect(store.statistics()).toEqual(DEFAULT_STATS);
    });

    it('should have empty openTransactions', () => {
      expect(store.openTransactions()).toEqual([]);
    });

    it('should have empty overdueTransactions', () => {
      expect(store.overdueTransactions()).toEqual([]);
    });

    it('should have empty messages', () => {
      expect(store.messages()).toEqual([]);
    });

    it('should have totalFeesEngaged at 0', () => {
      expect(store.totalFeesEngaged()).toBe(0);
    });
  });

  // ─── loadPatron ─────────────────────────────────────────────────────────────

  describe('loadPatron()', () => {
    it('should set patron from service', () => {
      store.loadPatron('barcode1');
      expect(patronServiceMock.getPatron).toHaveBeenCalledWith('barcode1');
      expect(store.patron()).toEqual(PATRON);
    });

    it('should set patron to undefined when service returns null', () => {
      patronServiceMock.getPatron.mockReturnValue(of(null));
      store.loadPatron('unknown');
      expect(store.patron()).toBeUndefined();
    });

    it('should not call service when barcode is empty', () => {
      store.loadPatron('');
      expect(patronServiceMock.getPatron).not.toHaveBeenCalled();
    });
  });

  // ─── loadStats ──────────────────────────────────────────────────────────────

  describe('loadStats()', () => {
    it('should update pending, pickup, loan and ill statistics', () => {
      store.loadStats('p1');
      const stats = store.statistics();
      expect(stats.pending).toBe(3); // PENDING(2) + ITEM_IN_TRANSIT_FOR_PICKUP(1)
      expect(stats.pickup).toBe(3);
      expect(stats.loan).toBe(5);
      expect(stats.ill).toBe(2);
    });

    it('should update messages from circulation informations', () => {
      store.loadStats('p1');
      expect(store.messages()).toEqual([{ severity: 'warn', detail: 'Test message' }]);
    });

    it('should not modify patron, openTransactions or overdueTransactions', () => {
      store.loadStats('p1');
      expect(store.patron()).toBeUndefined();
      expect(store.openTransactions()).toEqual([]);
      expect(store.overdueTransactions()).toEqual([]);
    });

    it('should replace messages on each call', () => {
      store.loadStats('p1');
      expect(store.messages().length).toBe(1);

      patronServiceMock.getCirculationInformations.mockReturnValue(of({ statistics: {}, messages: [] }));
      store.loadStats('p1');
      expect(store.messages()).toEqual([]);
    });

    it('should not call service when patronPid is empty', () => {
      store.loadStats('');
      expect(patronServiceMock.getCirculationInformations).not.toHaveBeenCalled();
    });
  });

  // ─── loadFees ───────────────────────────────────────────────────────────────

  describe('loadFees()', () => {
    it('should update overdueTransactions', () => {
      store.loadFees('p1');
      expect(store.overdueTransactions()).toEqual(OVERDUE_PREVIEWS);
    });

    it('should update openTransactions', () => {
      store.loadFees('p1');
      expect(store.openTransactions()).toEqual(OPEN_TRANSACTIONS);
    });

    it('should compute overdueFees as sum of overdue totals', () => {
      store.loadFees('p1');
      expect(store.statistics().overdueFees).toBe(15); // 10 + 5
    });

    it('should compute feesEngaged as sum of open transaction amounts', () => {
      store.loadFees('p1');
      expect(store.statistics().feesEngaged).toBe(12); // 8 + 4
    });

    it('should compute fees as overdueFees + feesEngaged', () => {
      store.loadFees('p1');
      expect(store.statistics().fees).toBe(27); // 15 + 12
    });

    it('should update totalFeesEngaged computed', () => {
      store.loadFees('p1');
      expect(store.totalFeesEngaged()).toBe(12); // computed from openTransactions
    });

    it('should not call services when patronPid is falsy', () => {
      store.loadFees(undefined);
      expect(patronServiceMock.getOverduePreview).not.toHaveBeenCalled();
      expect(patronTransactionServiceMock.patronTransactionsByPatron).not.toHaveBeenCalled();
    });
  });

  // ─── reloadOpenTransactions ─────────────────────────────────────────────────

  describe('reloadOpenTransactions()', () => {
    beforeEach(() => {
      store.loadFees('p1');
    });

    it('should update openTransactions only', () => {
      const newTransactions = [makeTransaction(20)];
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of(newTransactions));
      store.reloadOpenTransactions('p1');
      expect(store.openTransactions()).toEqual(newTransactions);
    });

    it('should not modify overdueTransactions', () => {
      const before = store.overdueTransactions();
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of([]));
      store.reloadOpenTransactions('p1');
      expect(store.overdueTransactions()).toEqual(before);
    });

    it('should update feesEngaged based on new transactions', () => {
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of([makeTransaction(30)]));
      store.reloadOpenTransactions('p1');
      expect(store.statistics().feesEngaged).toBe(30);
    });

    it('should update fees as overdueFees + new feesEngaged', () => {
      const overdueFees = store.statistics().overdueFees; // 15 from beforeEach
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of([makeTransaction(7)]));
      store.reloadOpenTransactions('p1');
      expect(store.statistics().fees).toBe(overdueFees + 7);
    });

    it('should update totalFeesEngaged reactively', () => {
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of([makeTransaction(50)]));
      store.reloadOpenTransactions('p1');
      expect(store.totalFeesEngaged()).toBe(50);
    });

    it('should not call service when patronPid is empty', () => {
      const callsBefore = patronTransactionServiceMock.patronTransactionsByPatron.mock.calls.length;
      store.reloadOpenTransactions('');
      expect(patronTransactionServiceMock.patronTransactionsByPatron.mock.calls.length).toBe(callsBefore);
    });
  });

  // ─── clear ──────────────────────────────────────────────────────────────────

  describe('clear()', () => {
    beforeEach(() => {
      store.loadPatron('barcode1');
      store.loadStats('p1');
    });

    it('should reset patron to undefined', () => {
      store.clear();
      expect(store.patron()).toBeUndefined();
    });

    it('should reset statistics to zeros', () => {
      store.clear();
      expect(store.statistics()).toEqual(DEFAULT_STATS);
    });

    it('should reset openTransactions to empty', () => {
      store.clear();
      expect(store.openTransactions()).toEqual([]);
    });

    it('should reset overdueTransactions to empty', () => {
      store.clear();
      expect(store.overdueTransactions()).toEqual([]);
    });

    it('should reset messages to empty', () => {
      store.clear();
      expect(store.messages()).toEqual([]);
    });

    it('should reset totalFeesEngaged to 0', () => {
      store.clear();
      expect(store.totalFeesEngaged()).toBe(0);
    });
  });

  // ─── clearMessages ──────────────────────────────────────────────────────────

  describe('clearMessages()', () => {
    beforeEach(() => {
      store.loadStats('p1');
    });

    it('should empty messages array', () => {
      expect(store.messages().length).toBeGreaterThan(0);
      store.clearMessages();
      expect(store.messages()).toEqual([]);
    });

    it('should not affect patron', () => {
      store.clearMessages();
      expect(store.patron()).toBeUndefined();
    });

    it('should not affect statistics', () => {
      const before = store.statistics();
      store.clearMessages();
      expect(store.statistics()).toEqual(before);
    });

    it('should not affect openTransactions', () => {
      store.clearMessages();
      expect(store.openTransactions()).toEqual([]);
    });
  });

  // ─── totalFeesEngaged computed ──────────────────────────────────────────────

  describe('totalFeesEngaged (computed)', () => {
    it('should return 0 when openTransactions is empty', () => {
      expect(store.totalFeesEngaged()).toBe(0);
    });

    it('should sum amounts of open transactions', () => {
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(
        of([makeTransaction(5), makeTransaction(3), makeTransaction(2)])
      );
      store.loadFees('p1');
      expect(store.totalFeesEngaged()).toBe(10);
    });

    it('should exclude closed transactions from total', () => {
      const closed = makeTransaction(100, PatronTransactionStatus.CLOSED);
      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(
        of([makeTransaction(7), closed])
      );
      store.loadFees('p1');
      expect(store.totalFeesEngaged()).toBe(7);
    });

    it('should update reactively after reloadOpenTransactions', () => {
      store.loadFees('p1');
      expect(store.totalFeesEngaged()).toBe(12);

      patronTransactionServiceMock.patronTransactionsByPatron.mockReturnValue(of([makeTransaction(25)]));
      store.reloadOpenTransactions('p1');
      expect(store.totalFeesEngaged()).toBe(25);
    });
  });
});
