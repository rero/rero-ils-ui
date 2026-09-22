// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionRecord } from '@app/admin/circulation/model/circulation.model';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore, OperationLogsApiService } from '@rero/shared';
import { of } from 'rxjs';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionsHistoryComponent } from './transactions-history.component';

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

// ─── Mock child component ───────────────────────────────────────────────────
// Avoids pulling in RecordService/ItemsService/PatronTransactionService just
// to render the list — this spec only cares about grouping/sorting/loading.

@Component({
  selector: 'admin-transaction-history',
  template: '',
})
class MockTransactionHistoryComponent {
  transaction = input.required<TransactionRecord>();
  closeRequested = output<void>();
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

const operationLogsApiServiceMock = {
  getCirculationTransactionsByUser: vi.fn().mockReturnValue(of(makeEsResult([], 0))),
};

const appStoreMock = {
  user: signal<{ patronLibrarian?: { pid: string } } | null>(null),
};

describe('TransactionsHistoryComponent', () => {
  let component: TransactionsHistoryComponent;
  let fixture: ComponentFixture<TransactionsHistoryComponent>;

  const connectLibrarian = (pid: string): void => {
    appStoreMock.user.set({ patronLibrarian: { pid } });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([], 0)));
    appStoreMock.user.set(null);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TransactionsHistoryComponent],
      providers: [
        { provide: OperationLogsApiService, useValue: operationLogsApiServiceMock },
        { provide: AppStore, useValue: appStoreMock },
      ],
    })
      .overrideComponent(TransactionsHistoryComponent, {
        remove: { imports: [TransactionHistoryComponent] },
        add: { imports: [MockTransactionHistoryComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load transactions without connected librarian', () => {
    fixture.detectChanges();
    expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).not.toHaveBeenCalled();
  });

  it('should load the transactions of the connected librarian', () => {
    connectLibrarian('patron-1');
    expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).toHaveBeenCalledWith('patron-1', 1, 10);
  });

  it('should reload transactions when the connected librarian changes', () => {
    connectLibrarian('patron-1');
    connectLibrarian('patron-2');
    expect(operationLogsApiServiceMock.getCirculationTransactionsByUser).toHaveBeenLastCalledWith('patron-2', 1, 10);
  });

  it('should render one admin-transaction-history per transaction', () => {
    const transaction = makeLoanTransaction('t1', '2026-09-22T10:00:00+00:00');
    operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([transaction], 1)));

    connectLibrarian('patron-1');

    const lines = fixture.nativeElement.querySelectorAll('admin-transaction-history');
    expect(lines.length).toBe(1);
  });

  it('should emit closeRequested when the child component emits it', () => {
    const transaction = makeLoanTransaction('t1', '2026-09-22T10:00:00+00:00');
    operationLogsApiServiceMock.getCirculationTransactionsByUser.mockReturnValue(of(makeEsResult([transaction], 1)));
    connectLibrarian('patron-1');

    let emitted = false;
    component.closeRequested.subscribe(() => emitted = true);

    const line: MockTransactionHistoryComponent = fixture.debugElement
      .query((debugElement) => debugElement.componentInstance instanceof MockTransactionHistoryComponent)
      .componentInstance;
    line.closeRequested.emit();

    expect(emitted).toBe(true);
  });

  describe('sortByDateDesc()', () => {
    it('should sort keys in descending order', () => {
      const result = component['sortByDateDesc'](
        { key: '2026-09-20', value: [] },
        { key: '2026-09-22', value: [] }
      );
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for equal keys', () => {
      const result = component['sortByDateDesc'](
        { key: '2026-09-22', value: [] },
        { key: '2026-09-22', value: [] }
      );
      expect(result).toBe(0);
    });
  });
});
