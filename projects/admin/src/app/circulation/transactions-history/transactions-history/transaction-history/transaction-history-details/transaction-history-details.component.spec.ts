// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '@app/admin/classes/items';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { TransactionHistoryDetailsComponent } from './transaction-history-details.component';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const LOCATION_RECORD = {
  metadata: { pid: 'loc-1', name: 'Espace lecture', library: { pid: 'lib-1' } },
};

const recordServiceMock = {
  getRecord: vi.fn((type: string) => {
    switch (type) {
      case 'locations': return of(LOCATION_RECORD);
      case 'libraries': return of('Bibliothèque cantonale');
      default: return of(undefined);
    }
  }),
};

describe('TransactionHistoryDetailsComponent', () => {
  let component: TransactionHistoryDetailsComponent;
  let fixture: ComponentFixture<TransactionHistoryDetailsComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    recordServiceMock.getRecord.mockImplementation((type: string) => {
      switch (type) {
        case 'locations': return of(LOCATION_RECORD);
        case 'libraries': return of('Bibliothèque cantonale');
        default: return of(undefined);
      }
    });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TransactionHistoryDetailsComponent],
      providers: [{ provide: RecordService, useValue: recordServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create with no inputs set', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display any field when fullItem/loan/scan are all empty', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should display the Unit field from fullItem.enumerationAndChronology', () => {
    fixture.componentRef.setInput('fullItem', { enumerationAndChronology: '2024, n°3' } as Item);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2024, n°3');
  });

  it('should display the resolved Location from fullItem.location', async () => {
    fixture.componentRef.setInput('fullItem', { location: { pid: 'loc-1' } } as unknown as Item);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(recordServiceMock.getRecord).toHaveBeenCalledWith('locations', 'loc-1', expect.anything());
    expect(fixture.nativeElement.textContent).toContain('Espace lecture');
  });

  it('should display the Temporary location field', () => {
    fixture.componentRef.setInput('fullItem', { temporary_location: { name: 'Dépôt' } } as unknown as Item);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dépôt');
  });

  it('should display the Exhibition/course field when collections are not empty', () => {
    fixture.componentRef.setInput('fullItem', { collections: ['Coup de cœur', 'Nouveautés'] } as unknown as Item);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Coup de cœur, Nouveautés');
  });

  it('should not display the Exhibition/course field when collections is empty', () => {
    fixture.componentRef.setInput('fullItem', { collections: [] } as unknown as Item);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should display the loan note', () => {
    fixture.componentRef.setInput('loan', { note: 'Checkin note — vérifier le CD' } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Checkin note — vérifier le CD');
  });

  it('should display the scan note', () => {
    fixture.componentRef.setInput('scan', { note: 'No circulation action performed: on shelf' } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No circulation action performed: on shelf');
  });

  it('should display both loan and scan notes if somehow both are set', () => {
    fixture.componentRef.setInput('loan', { note: 'Loan note' } as any);
    fixture.componentRef.setInput('scan', { note: 'Scan note' } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loan note');
    expect(fixture.nativeElement.textContent).toContain('Scan note');
  });
});
