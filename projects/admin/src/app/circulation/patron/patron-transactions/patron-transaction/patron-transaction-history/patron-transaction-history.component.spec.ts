// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatronService } from '@app/admin/service/patron.service';
import { provideTranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { NEVER, of, throwError } from 'rxjs';

import { PatronTransactionHistoryComponent } from './patron-transaction-history.component';

describe('PatronTransactionHistoryComponent', () => {
  let fixture: ComponentFixture<PatronTransactionHistoryComponent>;
  const patronService = { getPatronByPid: vi.fn() };

  /**
   * Render a single event and return the text of its operator row.
   * @param event - the event to render
   * @returns the label and the value of the operator row, with collapsed whitespace, or null without row
   */
  function renderOperator(event: object): string | null {
    fixture = TestBed.createComponent(PatronTransactionHistoryComponent);
    fixture.componentRef.setInput('events', [{ type: 'fee', amount: 10, pid: '1', ...event }]);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.fa-user');
    return icon ? icon.parentElement.parentElement.textContent.replace(/\s+/g, ' ').trim() : null;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatronTransactionHistoryComponent],
      providers: [
        provideTranslateService(),
        { provide: PatronService, useValue: patronService },
        { provide: AppStore, useValue: { organisation: () => ({ default_currency: 'CHF' }) } },
      ],
    });
  });

  afterEach(() => vi.resetAllMocks());

  it('should render the operator name, without a space before the comma', () => {
    patronService.getPatronByPid.mockReturnValue(of({ last_name: 'Doe', first_name: 'John' }));
    expect(renderOperator({ operator: { pid: '2' } })).toBe('Operator Doe, John');
    expect(patronService.getPatronByPid).toHaveBeenCalledWith('2');
  });

  it('should not render the operator of an event created by the system', () => {
    expect(renderOperator({})).toBeNull();
    expect(patronService.getPatronByPid).not.toHaveBeenCalled();
  });

  it('should not render the operator while it is loading', () => {
    patronService.getPatronByPid.mockReturnValue(NEVER);
    expect(renderOperator({ operator: { pid: '2' } })).toBeNull();
  });

  it('should render unknown for an operator that does not exist anymore', () => {
    patronService.getPatronByPid.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 410 })));
    expect(renderOperator({ operator: { pid: '2' } })).toBe('Operator Unknown');
  });

  it('should keep rendering the event when the operator cannot be loaded', () => {
    TestBed.configureTestingModule({ rethrowApplicationErrors: false });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    patronService.getPatronByPid.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    expect(renderOperator({ operator: { pid: '2' } })).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('fee');
    expect(consoleError).toHaveBeenCalled();
  });
});
