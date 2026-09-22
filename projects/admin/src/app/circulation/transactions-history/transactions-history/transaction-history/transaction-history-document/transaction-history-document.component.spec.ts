// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DocumentRecord } from '@app/admin/circulation/model/circulation.model';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionHistoryDocumentComponent } from './transaction-history-document.component';

describe('TransactionHistoryDocumentComponent', () => {
  let component: TransactionHistoryDocumentComponent;
  let fixture: ComponentFixture<TransactionHistoryDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TransactionHistoryDocumentComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryDocumentComponent);
    component = fixture.componentInstance;
    // Prevent RouterLink from triggering a real (async) navigation on click,
    // which would otherwise still be in flight once this test's fixture is
    // destroyed and surface as an unhandled "Injector already destroyed" error.
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the document title as a link to its detail page', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.textContent.trim()).toBe('Bundesgerichtspraxis');
  });

  it('should emit closeRequested when the document link is clicked', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.detectChanges();

    let emitted = false;
    component.closeRequested.subscribe(() => emitted = true);

    fixture.nativeElement.querySelector('a').click();

    expect(emitted).toBe(true);
  });

  it('should not display contributions when the document has none', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.componentRef.setInput('document', { metadata: { pid: 'doc-1', contribution: [] } } as unknown as DocumentRecord);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-contribution')).toBeNull();
  });

  it('should not display contributions when the document is not loaded yet', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-contribution')).toBeNull();
  });

  it('should display contributions when the document has some', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.componentRef.setInput('document', {
      metadata: {
        pid: 'doc-1',
        contribution: [{ entity: { type: 'bf:Person', authorized_access_point: 'Doe, John' }, role: ['aut'] }],
      },
    } as unknown as DocumentRecord);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-contribution')).toBeTruthy();
  });

  it('should not display a "not found" message when the document is still loading', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Document not found');
  });

  it('should display the title as plain text (no link) and a "not found" message when the document failed to load', () => {
    fixture.componentRef.setInput('documentPid', 'doc-1');
    fixture.componentRef.setInput('documentTitle', 'Bundesgerichtspraxis');
    fixture.componentRef.setInput('documentNotFound', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bundesgerichtspraxis');
    expect(fixture.nativeElement.textContent).toContain('Document not found');
    // No link to the document's detail page, since it doesn't exist (would 404).
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
});
