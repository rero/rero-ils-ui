// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { IllRequestDetailViewComponent } from './ill-request-detail-view.component';

describe('IllRequestDetailViewComponent', () => {
  let component: IllRequestDetailViewComponent;
  let fixture: ComponentFixture<IllRequestDetailViewComponent>;

  /**
   * Create the component for an ILL request whose document is published in the given source.
   * @param source - the source of the requested document
   */
  function withSource(source: object): void {
    fixture = TestBed.createComponent(IllRequestDetailViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('record', {
      metadata: { pid: '1', status: 'pending', document: { title: 'Article', source } },
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IllRequestDetailViewComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        { provide: RecordService, useValue: { getRecord: vi.fn(() => of(null)) } },
      ],
    });
  });

  describe('sourceNumbering', () => {
    it('should join the volume and the number', () => {
      withSource({ journal_title: 'Journal', volume: '3', number: '4' });
      expect(component.sourceNumbering()).toBe('Vol.3 — n° 4');
    });

    it('should keep the volume alone', () => {
      withSource({ journal_title: 'Journal', volume: '3' });
      expect(component.sourceNumbering()).toBe('Vol.3');
    });

    it('should keep the number alone', () => {
      withSource({ journal_title: 'Journal', number: '4' });
      expect(component.sourceNumbering()).toBe('n° 4');
    });

    it('should be empty without volume nor number', () => {
      withSource({ journal_title: 'Journal' });
      expect(component.sourceNumbering()).toBe('');
    });
  });

  it('should render the numbering between parentheses, without inner spaces', () => {
    withSource({ journal_title: 'Journal', volume: '3', number: '4' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.replace(/\s+/g, ' ')).toContain('Journal (Vol.3 — n° 4)');
  });
});
