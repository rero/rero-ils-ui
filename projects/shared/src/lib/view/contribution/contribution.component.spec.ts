// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ContributionComponent } from './contribution.component';

describe('ContributionComponent', () => {
  let fixture: ComponentFixture<ContributionComponent>;

  const contributions = ['A', 'B', 'C', 'D'].map((name) => ({
    entity: { type: 'bf:Person', authorized_access_point: name },
    role: ['aut'],
  }));

  /** Rendered text, whitespace collapsed */
  const text = (): string => fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(ContributionComponent);
    fixture.componentRef.setInput('contributions', contributions);
    fixture.componentRef.setInput('activateLink', false);
  });

  it('should list all contributors without ellipsis', async () => {
    await fixture.whenStable();
    expect(text()).toEqual('A ; B ; C ; D');
  });

  it('should add a single ellipsis after the last displayed contributor', async () => {
    fixture.componentRef.setInput('limitRecord', 2);
    await fixture.whenStable();
    expect(text()).toEqual('A ; B ; …');
  });
});
