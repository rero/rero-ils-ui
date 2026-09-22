// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  DocumentRecord,
  ItemRecord,
  LibraryRecord,
  PatronRecord,
  TransactionRecord,
} from '@app/admin/circulation/model/circulation.model';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { ItemsService } from '@app/admin/service/items.service';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { of, throwError } from 'rxjs';
import { TransactionHistoryComponent } from './transaction-history.component';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeLoanTransaction(): TransactionRecord {
  return {
    id: 't1',
    created: '2026-09-22T10:00:00+00:00',
    updated: '2026-09-22T10:00:00+00:00',
    links: { self: 'https://bib.rero.ch/api/operation_logs/t1' },
    metadata: {
      date: '2026-09-22T10:00:00+00:00',
      record: { type: 'loan', value: '1' },
      loan: {
        pid: 'loan-1',
        trigger: 'checkout',
        state: 'ITEM_ON_LOAN',
        item: { pid: 'item-1', document: { pid: 'doc-1', title: 'Bundesgerichtspraxis' } },
        patron: { pid: 'patron-1', name: 'Casalini, Simonetta' },
      },
    },
  } as unknown as TransactionRecord;
}

function makeScanTransaction(): TransactionRecord {
  return {
    id: 't2',
    created: '2026-09-22T08:40:00+00:00',
    updated: '2026-09-22T08:40:00+00:00',
    links: { self: 'https://bib.rero.ch/api/operation_logs/t2' },
    metadata: {
      date: '2026-09-22T08:40:00+00:00',
      record: { type: 'scan_item', value: '605' },
      library: { type: 'lib', value: '4' },
      scan: {
        item: { pid: 'item-2', document: { pid: 'doc-2', title: 'Notes en herbe' } },
      },
      user_name: 'Müller, Astrid',
    },
  } as unknown as TransactionRecord;
}

const ITEM_RECORD: ItemRecord = {
  id: 'item-1',
  metadata: { pid: 'item-1', barcode: '10000000441', call_number: '00441' },
} as unknown as ItemRecord;

const DOCUMENT_RECORD: DocumentRecord = {
  id: 'doc-1',
  metadata: { pid: 'doc-1', contribution: [] },
} as unknown as DocumentRecord;

const PATRON_RECORD: PatronRecord = {
  id: 'patron-1',
  metadata: { pid: 'patron-1', patron: { barcode: ['2050124312'] } },
} as unknown as PatronRecord;

const LIBRARY_RECORD: LibraryRecord = {
  id: 'lib-4',
  metadata: { pid: '4', name: 'Bibliothèque du Lycée' },
} as unknown as LibraryRecord;

// ─── Mocks ────────────────────────────────────────────────────────────────────

const recordServiceMock = {
  getRecord: vi.fn((type: string) => {
    switch (type) {
      case 'items': return of(ITEM_RECORD);
      case 'documents': return of(DOCUMENT_RECORD);
      case 'patrons': return of(PATRON_RECORD);
      case 'libraries': return of(LIBRARY_RECORD);
      default: return of(undefined);
    }
  }),
};

const itemsServiceMock = {
  getItem: vi.fn().mockReturnValue(of(undefined)),
};

const patronTransactionServiceMock = {
  patronTransactionsByLoan: vi.fn().mockReturnValue(of([])),
};

const appStoreMock = {
  organisation: vi.fn().mockReturnValue({ default_currency: 'CHF' }),
  canAccessDebugMode: vi.fn().mockReturnValue(false),
};

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    recordServiceMock.getRecord.mockImplementation((type: string) => {
      switch (type) {
        case 'items': return of(ITEM_RECORD);
        case 'documents': return of(DOCUMENT_RECORD);
        case 'patrons': return of(PATRON_RECORD);
        case 'libraries': return of(LIBRARY_RECORD);
        default: return of(undefined);
      }
    });
    itemsServiceMock.getItem.mockReturnValue(of(undefined));
    patronTransactionServiceMock.patronTransactionsByLoan.mockReturnValue(of([]));
    appStoreMock.organisation.mockReturnValue({ default_currency: 'CHF' });
    appStoreMock.canAccessDebugMode.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TransactionHistoryComponent],
      providers: [
        provideRouter([]),
        { provide: RecordService, useValue: recordServiceMock },
        { provide: ItemsService, useValue: itemsServiceMock },
        { provide: PatronTransactionService, useValue: patronTransactionServiceMock },
        { provide: AppStore, useValue: appStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
  });

  const createWith = async (transaction: TransactionRecord) => {
    fixture.componentRef.setInput('transaction', transaction);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('should create', async () => {
    await createWith(makeLoanTransaction());
    expect(component).toBeTruthy();
  });

  // ─── loan / scan_item discrimination ────────────────────────────────────────

  describe('isLoan()', () => {
    it('should be true for a loan entry', async () => {
      await createWith(makeLoanTransaction());
      expect(component['isLoan']()).toBe(true);
    });

    it('should be false for a scan_item entry', async () => {
      await createWith(makeScanTransaction());
      expect(component['isLoan']()).toBe(false);
    });
  });

  describe('logLoan() / logScan()', () => {
    it('should expose loan and no scan for a loan entry', async () => {
      await createWith(makeLoanTransaction());
      expect(component['logLoan']()).toBeDefined();
      expect(component['logScan']()).toBeUndefined();
    });

    it('should expose scan and no loan for a scan_item entry', async () => {
      await createWith(makeScanTransaction());
      expect(component['logLoan']()).toBeUndefined();
      expect(component['logScan']()).toBeDefined();
    });
  });

  describe('documentPid() / documentTitle()', () => {
    it('should read them from loan.item.document for a loan entry', async () => {
      await createWith(makeLoanTransaction());
      expect(component['documentPid']()).toBe('doc-1');
      expect(component['documentTitle']()).toBe('Bundesgerichtspraxis');
    });

    it('should read them from scan.item.document for a scan_item entry', async () => {
      await createWith(makeScanTransaction());
      expect(component['documentPid']()).toBe('doc-2');
      expect(component['documentTitle']()).toBe('Notes en herbe');
    });
  });

  // ─── item / fullItem loading ────────────────────────────────────────────────

  describe('item loading', () => {
    it('should fetch the item by pid from the ES-backed items resource', async () => {
      await createWith(makeLoanTransaction());
      expect(recordServiceMock.getRecord).toHaveBeenCalledWith('items', 'item-1');
      expect(component['item']()).toEqual(ITEM_RECORD);
      expect(component['itemNotFound']()).toBe(false);
    });

    it('should mark the item as not found and render a message when the items request fails', async () => {
      recordServiceMock.getRecord.mockImplementation((type: string) =>
        type === 'items' ? throwError(() => new Error('404')) : of(undefined)
      );
      await createWith(makeLoanTransaction());
      expect(component['item']()).toBeUndefined();
      expect(component['itemNotFound']()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Item not found');
    });

    it('should fall back to the call_number captured in the log entry when the item is not found (scan_item entry)', async () => {
      recordServiceMock.getRecord.mockImplementation((type: string) => {
        if (type === 'items') {
          return throwError(() => new Error('404'));
        }
        return type === 'libraries' ? of(LIBRARY_RECORD) : of(undefined);
      });
      const transaction = makeScanTransaction();
      (transaction.metadata as { scan: { item: { call_number?: string } } }).scan.item.call_number = '00605';
      await createWith(transaction);
      expect(component['itemNotFound']()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Item not found');
      expect(fixture.nativeElement.textContent).toContain('00605');
    });

    it('should fetch the full item via its barcode once the item is resolved', async () => {
      await createWith(makeLoanTransaction());
      expect(itemsServiceMock.getItem).toHaveBeenCalledWith('10000000441');
    });

    it('should not fetch the full item when the item has no barcode', async () => {
      const itemWithoutBarcode = { metadata: { pid: 'item-1' } } as unknown as ItemRecord;
      recordServiceMock.getRecord.mockImplementation((type: string) =>
        type === 'items' ? of(itemWithoutBarcode) : of(undefined)
      );
      await createWith(makeLoanTransaction());
      expect(itemsServiceMock.getItem).not.toHaveBeenCalled();
      expect(component['fullItem']()).toBeUndefined();
    });

    it('should keep fullItem undefined when ItemsService.getItem fails', async () => {
      itemsServiceMock.getItem.mockReturnValue(throwError(() => new Error('403')));
      await createWith(makeLoanTransaction());
      expect(component['fullItem']()).toBeUndefined();
    });
  });

  // ─── totalAmountOfFee ───────────────────────────────────────────────────────

  describe('totalAmountOfFee()', () => {
    it('should query fees using the loan pid captured in the log entry, not the item\'s currently attached loan', async () => {
      patronTransactionServiceMock.patronTransactionsByLoan.mockReturnValue(
        of([{ status: 'open', total_amount: 3.5 }, { status: 'open', total_amount: 4.3 }])
      );

      await createWith(makeLoanTransaction());

      expect(patronTransactionServiceMock.patronTransactionsByLoan).toHaveBeenCalledWith('loan-1', 'overdue', 'open');
      expect(component['totalAmountOfFee']()).toBeCloseTo(7.8);
    });

    it('should still resolve fees once the item no longer has this loan attached (e.g. after a later checkin)', async () => {
      itemsServiceMock.getItem.mockReturnValue(of({ loan: undefined }));
      patronTransactionServiceMock.patronTransactionsByLoan.mockReturnValue(
        of([{ status: 'open', total_amount: 3.5 }, { status: 'open', total_amount: 4.3 }])
      );

      await createWith(makeLoanTransaction());

      expect(patronTransactionServiceMock.patronTransactionsByLoan).toHaveBeenCalledWith('loan-1', 'overdue', 'open');
      expect(component['totalAmountOfFee']()).toBeCloseTo(7.8);
    });

    it('should fall back to 0 when the fees request fails', async () => {
      patronTransactionServiceMock.patronTransactionsByLoan.mockReturnValue(
        throwError(() => new Error('network'))
      );

      await createWith(makeLoanTransaction());

      expect(component['totalAmountOfFee']()).toBe(0);
    });

    it('should stay 0 for a scan_item entry, which has no loan', async () => {
      await createWith(makeScanTransaction());
      expect(component['totalAmountOfFee']()).toBe(0);
      expect(patronTransactionServiceMock.patronTransactionsByLoan).not.toHaveBeenCalled();
    });
  });

  describe('organisationCurrency()', () => {
    it('should read the default currency from AppStore', async () => {
      await createWith(makeLoanTransaction());
      expect(component['organisationCurrency']()).toBe('CHF');
    });
  });

  // ─── document loading ───────────────────────────────────────────────────────

  describe('document loading', () => {
    it('should fetch the document with resolve:1', async () => {
      await createWith(makeLoanTransaction());
      expect(recordServiceMock.getRecord).toHaveBeenCalledWith('documents', 'doc-1', { resolve: 1 });
      expect(component['document']()).toEqual(DOCUMENT_RECORD);
      expect(component['documentNotFound']()).toBe(false);
    });

    it('should mark the document as not found and render a message when the documents request fails', async () => {
      recordServiceMock.getRecord.mockImplementation((type: string) => {
        if (type === 'documents') {
          return throwError(() => new Error('404'));
        }
        return type === 'items' ? of(ITEM_RECORD) : type === 'patrons' ? of(PATRON_RECORD) : of(undefined);
      });
      await createWith(makeLoanTransaction());
      expect(component['document']()).toBeUndefined();
      expect(component['documentNotFound']()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Document not found.');
    });
  });

  // ─── patron / library loading ───────────────────────────────────────────────

  describe('patron loading', () => {
    it('should fetch the patron for a loan entry', async () => {
      await createWith(makeLoanTransaction());
      expect(recordServiceMock.getRecord).toHaveBeenCalledWith('patrons', 'patron-1');
      expect(component['patron']()).toEqual(PATRON_RECORD);
      expect(component['patronNotFound']()).toBe(false);
    });

    it('should stay undefined for a scan_item entry', async () => {
      await createWith(makeScanTransaction());
      expect(component['patron']()).toBeUndefined();
      expect(recordServiceMock.getRecord).not.toHaveBeenCalledWith('patrons', expect.anything());
    });

    it('should mark the patron as not found when the patrons request fails, without blocking the rest of the row', async () => {
      recordServiceMock.getRecord.mockImplementation((type: string) => {
        if (type === 'patrons') {
          return throwError(() => new Error('404'));
        }
        return type === 'items' ? of(ITEM_RECORD) : type === 'documents' ? of(DOCUMENT_RECORD) : of(undefined);
      });
      await createWith(makeLoanTransaction());
      expect(component['patron']()).toBeUndefined();
      expect(component['patronNotFound']()).toBe(true);
      // The patron's name still comes from the log entry itself, so the row renders normally.
      expect(fixture.nativeElement.textContent).toContain('Casalini, Simonetta');
    });
  });

  describe('library loading', () => {
    it('should fetch the library for a scan_item entry', async () => {
      await createWith(makeScanTransaction());
      expect(recordServiceMock.getRecord).toHaveBeenCalledWith('libraries', '4');
      expect(component['library']()).toEqual(LIBRARY_RECORD);
      expect(component['libraryNotFound']()).toBe(false);
    });

    it('should stay undefined for a loan entry', async () => {
      await createWith(makeLoanTransaction());
      expect(component['library']()).toBeUndefined();
      expect(recordServiceMock.getRecord).not.toHaveBeenCalledWith('libraries', expect.anything());
    });

    it('should mark the library as not found and render a message when the libraries request fails', async () => {
      recordServiceMock.getRecord.mockImplementation((type: string) => {
        if (type === 'libraries') {
          return throwError(() => new Error('404'));
        }
        return type === 'items' ? of(ITEM_RECORD) : type === 'documents' ? of(DOCUMENT_RECORD) : of(undefined);
      });
      await createWith(makeScanTransaction());
      expect(component['library']()).toBeUndefined();
      expect(component['libraryNotFound']()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Library not found.');
    });
  });

  // ─── isCollapsed / toggleRow ────────────────────────────────────────────────

  describe('toggleRow()', () => {
    it('should collapse the row by default', async () => {
      await createWith(makeLoanTransaction());
      expect(component['isCollapsed']()).toBe(true);
    });

    it('should expand the row when toggled with false', async () => {
      await createWith(makeLoanTransaction());
      component['toggleRow'](false);
      expect(component['isCollapsed']()).toBe(false);
    });

    it('should collapse the row again when toggled with true', async () => {
      await createWith(makeLoanTransaction());
      component['toggleRow'](false);
      component['toggleRow'](true);
      expect(component['isCollapsed']()).toBe(true);
    });
  });

  // ─── debug mode gating ──────────────────────────────────────────────────────

  describe('debug mode', () => {
    it('should not render the debug toggle when the user cannot access debug mode', async () => {
      appStoreMock.canAccessDebugMode.mockReturnValue(false);
      await createWith(makeLoanTransaction());
      component['toggleRow'](false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.fa-bug')).toBeNull();
    });

    it('should render the debug toggle when the user can access debug mode', async () => {
      appStoreMock.canAccessDebugMode.mockReturnValue(true);
      await createWith(makeLoanTransaction());
      component['toggleRow'](false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.fa-bug')).not.toBeNull();
    });

    it('should not render the raw transaction JSON even when debugMode is set, if the user cannot access debug mode', async () => {
      appStoreMock.canAccessDebugMode.mockReturnValue(false);
      await createWith(makeLoanTransaction());
      component['toggleRow'](false);
      component['debugMode'].set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Debug');
    });
  });
});
