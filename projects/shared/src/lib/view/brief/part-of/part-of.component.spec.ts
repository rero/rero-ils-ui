// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { PartOfComponent } from './part-of.component';

describe('PartOfComponent', () => {
  let component: PartOfComponent;
  let fixture: ComponentFixture<PartOfComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterModule, PartOfComponent],
      providers: [provideTranslateService({}), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the commas of the numbering without a space before them', () => {
    fixture.componentRef.setInput('isPublicView', true);
    fixture.componentRef.setInput('viewcode', 'global');
    fixture.componentRef.setInput('record', {
      metadata: {
        issuance: { subtype: 'periodical' },
        partOf: [
          { document: { pid: '1', title: 'Host' }, numbering: [{ year: '2020', volume: '2' }, { year: '2021' }] },
        ],
      },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.replace(/\s+/g, ' ')).toContain('Host ; 2020, vol. 2, 2021');
  });
});
