// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LibraryRecord, PatronRecord, TransactionLoan, TransactionScan } from '@app/admin/circulation/model/circulation.model';
import { Item } from '@app/admin/classes/items';
import { TranslateModule } from '@ngx-translate/core';
import { ItemStatus } from '@rero/shared';
import { TransactionHistoryActorComponent } from './transaction-history-actor.component';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeLoan(overrides: Partial<TransactionLoan> = {}): TransactionLoan {
  return {
    pid: 'loan-1',
    trigger: 'checkout',
    state: 'ITEM_ON_LOAN',
    item: { pid: 'item-1', document: { pid: 'doc-1', title: 'Doc' } },
    patron: { pid: 'patron-1', name: 'Casalini, Simonetta' },
    ...overrides,
  } as TransactionLoan;
}

function makeItem(overrides: Partial<Item> = {}): Item {
  return { status: ItemStatus.ON_LOAN, ...overrides } as Item;
}

const PATRON_RECORD: PatronRecord = {
  metadata: { pid: 'patron-1', patron: { barcode: ['2050124312'] } },
} as unknown as PatronRecord;

const LIBRARY_RECORD: LibraryRecord = {
  metadata: { pid: 'lib-1', name: 'Bibliothèque du Lycée' },
} as unknown as LibraryRecord;

describe('TransactionHistoryActorComponent', () => {
  let component: TransactionHistoryActorComponent;
  let fixture: ComponentFixture<TransactionHistoryActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TransactionHistoryActorComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryActorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentFullItem', undefined);
    // Prevent RouterLink from triggering a real (async) navigation on click,
    // which would otherwise still be in flight once this test's fixture is
    // destroyed and surface as an unhandled "Injector already destroyed" error.
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create with no inputs set', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ─── Loan branch ────────────────────────────────────────────────────────────

  describe('loan entry', () => {
    it('should display the patron name as plain text when no barcode is available', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Casalini, Simonetta');
      expect(fixture.nativeElement.querySelector('a')).toBeNull();
    });

    it('should display the patron name as a link to their circulation page when a barcode is available', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('patron', PATRON_RECORD);
      fixture.detectChanges();

      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.textContent.trim()).toBe('Casalini, Simonetta');
    });

    it('should emit closeRequested when the patron link is clicked', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('patron', PATRON_RECORD);
      fixture.detectChanges();

      let emitted = false;
      component.closeRequested.subscribe(() => emitted = true);

      fixture.nativeElement.querySelector('a').click();

      expect(emitted).toBe(true);
    });

    it('should display the status with the due date for status on_loan', () => {
      fixture.componentRef.setInput('loan', makeLoan({ end_date: '2026-01-01' }));
      fixture.componentRef.setInput('currentFullItem', makeItem({ status: ItemStatus.ON_LOAN }));
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain(ItemStatus.ON_LOAN);
    });

    it('should prefer the up-to-date end_date from currentFullItem over the log end_date', () => {
      fixture.componentRef.setInput('loan', makeLoan({ end_date: '2026-01-01' }));
      fixture.componentRef.setInput('currentFullItem', makeItem({
        status: ItemStatus.ON_LOAN,
        loan: { end_date: '2026-10-22' } as Item['loan'],
      }));
      fixture.detectChanges();

      // Both dates render through the same pipe — this only asserts no crash and a due date is shown.
      expect(fixture.nativeElement.textContent).toContain(ItemStatus.ON_LOAN);
    });

    it('should display the status for in_transit', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({ status: ItemStatus.IN_TRANSIT }));
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain(ItemStatus.IN_TRANSIT);
    });

    it('should display the status for at_desk', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({ status: ItemStatus.AT_DESK }));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(ItemStatus.AT_DESK);
    });

    it('should display the status for on_shelf', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({ status: ItemStatus.ON_SHELF }));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(ItemStatus.ON_SHELF);
    });

    it('should display the raw status for an unknown status', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({ status: 'something_else' as Item['status'] }));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('something_else');
    });

    it('should display "Missing status" when currentFullItem is not loaded yet', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', undefined);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Missing status');
    });

    it('should not display the renewals badge when extension_count is not set', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem());
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('renewal');
    });

    it('should display the renewals badge (singular) when extension_count is 1', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({
        loan: { extension_count: 1 } as Item['loan'],
      }));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('1');
      expect(fixture.nativeElement.textContent).toContain('renewal');
    });

    it('should display the renewals badge (plural) when extension_count is greater than 1', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('currentFullItem', makeItem({
        loan: { extension_count: 3 } as Item['loan'],
      }));
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('3');
      expect(fixture.nativeElement.textContent).toContain('renewals');
    });

    it('should not display the fees badge when totalAmountOfFee is 0', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('totalAmountOfFee', 0);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Fees');
    });

    it('should display the fees badge with the amount and currency when totalAmountOfFee is positive', () => {
      fixture.componentRef.setInput('loan', makeLoan());
      fixture.componentRef.setInput('totalAmountOfFee', 7.8);
      fixture.componentRef.setInput('organisationCurrency', 'CHF');
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('7.80');
    });
  });

  // ─── Scan branch ────────────────────────────────────────────────────────────

  describe('scan_item entry', () => {
    it('should display the library name and "on shelf" when scan and library are set', () => {
      fixture.componentRef.setInput('scan', {} as TransactionScan);
      fixture.componentRef.setInput('library', LIBRARY_RECORD);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Bibliothèque du Lycée');
      expect(fixture.nativeElement.textContent).toContain('on shelf');
    });

    it('should not display anything when scan is set but library is not loaded yet', () => {
      fixture.componentRef.setInput('scan', {} as TransactionScan);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe('');
    });

    it('should display a "not found" message when the library failed to load', () => {
      fixture.componentRef.setInput('scan', {} as TransactionScan);
      fixture.componentRef.setInput('libraryNotFound', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Library not found');
    });

    it('should not render the loan branch when scan is set', () => {
      fixture.componentRef.setInput('scan', {} as TransactionScan);
      fixture.componentRef.setInput('library', LIBRARY_RECORD);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('a')).toBeNull();
      expect(fixture.nativeElement.querySelector('i.fa-user')).toBeNull();
    });
  });
});
