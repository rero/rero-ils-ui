// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';
import { OperationLogsApiService } from '@rero/shared';
import { TransactionRecord } from '../model/circulation.model';
import { transactionsHistoryStore } from './transactions-history.store';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeLoanTransaction(id: string, date: string): TransactionRecord {
  return {
    id,
    created: date,
    updated: date,
    links: { self: `https://bib.rero.ch/api/operation_logs/${id}` },
    metadata: {
      date,
      record: { type: 'loan', value: '1' },
      loan: {
        pid: `loan-${id}`,
        trigger: 'checkout',
        state: 'ITEM_ON_LOAN',
        item: { pid: `item-${id}`, document: { pid: `doc-${id}`, title: `Document ${id}` } },
        patron: { pid: `patron-${id}`, name: 'Doe, John' },
      },
    },
  } as unknown as TransactionRecord;
}

function makeEsResult(hits: TransactionRecord[], total: number) {
  return { aggregations: {}, hits: { hits, total }, links: {} };
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

const operationLogsApiServiceMock = {
  getCirculationTransactionsByUser: vi.fn().mockReturnValue(of(makeEsResult([], 0))),
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('transactionsHistoryStore', () => {
  let store: InstanceType<typeof transactionsHistoryStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([], 0)));

    TestBed.configureTestingModule({
      providers: [
        transactionsHistoryStore,
        { provide: OperationLogsApiService, useValue: operationLogsApiServiceMock },
      ],
    });
    store = TestBed.inject(transactionsHistoryStore);
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('should have empty transactions', () => {
      expect(store.transactions()).toEqual([]);
    });

    it('should have total at 0', () => {
      expect(store.total()).toBe(0);
    });

    it('should initialize the paginator with the given config', () => {
      expect(store.pager()).toEqual({
        page: 1,
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50],
      });
    });

    it('should have empty dateTransactions', () => {
      expect(store.dateTransactions()).toEqual({});
    });

    it('should have isPaginatorEnabled false (rows >= total)', () => {
      expect(store.isPaginatorEnabled()).toBe(false);
    });
  });

  // ─── loadTransactions() ─────────────────────────────────────────────────────

  describe('loadTransactions()', () => {
    it('should not call the service when userPid is empty', () => {
      store.loadTransactions('');
      expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).not.toHaveBeenCalled();
    });

    it('should call the service with the userPid and the current pager', () => {
      store.loadTransactions('patron-1');
      expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).toHaveBeenCalledWith('patron-1', 1, 10);
    });

    it('should set transactions from the API result', () => {
      const transaction = makeLoanTransaction('t1', '2026-09-22T10:00:00+00:00');
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([transaction], 1)));

      store.loadTransactions('patron-1');

      expect(store.transactions()).toEqual([transaction]);
    });

    it('should set total from the API result', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of(makeEsResult([], 42))
      );

      store.loadTransactions('patron-1');

      expect(store.total()).toBe(42);
    });

    it('should default total to 0 when the result has no total', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of({ aggregations: {}, hits: { hits: [] }, links: {} })
      );

      store.loadTransactions('patron-1');

      expect(store.total()).toBe(0);
    });

    it('should leave the state untouched when the API returns an error payload', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of({ status: 500, title: 'Internal error' })
      );

      store.loadTransactions('patron-1');

      expect(store.transactions()).toEqual([]);
      expect(store.total()).toBe(0);
    });

    it('should not throw when the service observable errors out', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        throwError(() => new Error('network error'))
      );

      expect(() => store.loadTransactions('patron-1')).not.toThrow();
    });
  });

  // ─── setPaginator() ─────────────────────────────────────────────────────────

  describe('setPaginator()', () => {
    it('should update the pager page and first index', () => {
      store.setPaginator({ page: 1, first: 10, rows: 10, pageCount: 3 });
      expect(store.pager().page).toBe(2);
      expect(store.pager().first).toBe(11);
    });

    it('should reload transactions for the given user when the page changes', () => {
      store.setPaginator({ page: 1, first: 10, rows: 10, pageCount: 3 }, 'patron-1');
      expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).toHaveBeenCalledWith('patron-1', 2, 10);
    });

    it('should not reload transactions when no userPid is given', () => {
      store.setPaginator({ page: 1, first: 10, rows: 10, pageCount: 3 });
      expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).not.toHaveBeenCalled();
    });
  });

  // ─── dateTransactions (computed) ────────────────────────────────────────────

  describe('dateTransactions (computed)', () => {
    it('should group transactions by day, ignoring the time', () => {
      const morning = makeLoanTransaction('t1', '2026-09-22T08:00:00+00:00');
      const evening = makeLoanTransaction('t2', '2026-09-22T18:00:00+00:00');
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of(makeEsResult([morning, evening], 2))
      );

      store.loadTransactions('patron-1');

      expect(store.dateTransactions()).toEqual({
        '2026-09-22': [morning, evening],
      });
    });

    it('should sort date groups in descending order (most recent first)', () => {
      const older = makeLoanTransaction('t1', '2026-09-20T10:00:00+00:00');
      const newer = makeLoanTransaction('t2', '2026-09-22T10:00:00+00:00');
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of(makeEsResult([older, newer], 2))
      );

      store.loadTransactions('patron-1');

      expect(Object.keys(store.dateTransactions())).toEqual(['2026-09-22', '2026-09-20']);
    });

    it('should group a transaction by its local calendar day, not the UTC date prefix', () => {
      // 2026-09-22T23:30:00+00:00 is already 2026-09-23 in a UTC+1/+2 timezone
      // (e.g. Switzerland) — the day header must reflect that, not the UTC date.
      const isoDate = '2026-09-22T23:30:00+00:00';
      const lateEvening = makeLoanTransaction('t1', isoDate);
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of(makeEsResult([lateEvening], 1))
      );

      store.loadTransactions('patron-1');

      const utcDatePrefix = isoDate.substring(0, 10);
      const localDate = DateTime.fromISO(isoDate).toISODate();
      expect(Object.keys(store.dateTransactions())).toEqual([localDate]);
      if (localDate !== utcDatePrefix) {
        expect(Object.keys(store.dateTransactions())).not.toEqual([utcDatePrefix]);
      }
    });

    it('should keep transactions of the same day in their original order', () => {
      const first = makeLoanTransaction('t1', '2026-09-22T08:00:00+00:00');
      const second = makeLoanTransaction('t2', '2026-09-22T09:00:00+00:00');
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(
        of(makeEsResult([first, second], 2))
      );

      store.loadTransactions('patron-1');

      expect(store.dateTransactions()['2026-09-22']).toEqual([first, second]);
    });
  });

  // ─── isPaginatorEnabled (computed) ──────────────────────────────────────────

  describe('isPaginatorEnabled (computed)', () => {
    it('should be false when total is lower than or equal to the page size', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([], 10)));
      store.loadTransactions('patron-1');
      expect(store.isPaginatorEnabled()).toBe(false);
    });

    it('should be true when total exceeds the page size', () => {
      operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([], 11)));
      store.loadTransactions('patron-1');
      expect(store.isPaginatorEnabled()).toBe(true);
    });
  });
});
