/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ContributionFormatPipe } from './contribution-format.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

const contributionPerson = {
  agent: {
    authorized_access_point_en: 'Köhler, Peter Thomas (en)',
    authorized_access_point_fr: 'Köhler, Peter T (fr)',
    pid: '12809924',
    type: 'bf:Person'
  },
  role: [
    'cre'
  ]
};

const contributionMultipleRolesPerson = {
  agent: {
    authorized_access_point_en: 'Köhler, Peter Thomas (en)',
    authorized_access_point_fr: 'Köhler, Peter T (fr)',
    pid: '12809924',
    type: 'bf:Person'
  },
  role: [
    'cre',
    'con'
  ]
};

const contributionPreferredPerson = {
  agent: {
    authorized_access_point_en: 'Köhler, Peter Thomas (en)',
    authorized_access_point_fr: 'Köhler, Peter T (fr)',
    preferred_name: 'Köhler, Peter T',
    type: 'bf:Person'
  },
  role: [
    'cre'
  ]
};

const contributionOrganisation = {
  agent: {
    authorized_access_point_en: 'Vita et Pax Foundation (en)',
    authorized_access_point_fr: 'Vita et Pax Foundation (fr)',
    type: 'bf:Organisation'
  },
  role: [
    'ctb'
  ]
};

const contributionPreferredOrganisation = {
  agent: {
    preferred_name: 'Vita et Pax Foundation',
    type: 'bf:Organisation'
  },
  role: [
    'ctb'
  ]
};

describe('Pipe: ContributionFormate', () => {

  let contributionFormatPipe: ContributionFormatPipe;

  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ContributionFormatPipe,
        TranslateService
      ]
    });
    contributionFormatPipe = TestBed.get(ContributionFormatPipe);
    translateService = TestBed.get(TranslateService);
  });

  it('create an instance', () => {
    expect(contributionFormatPipe).toBeTruthy();
  });

  /* ----- Person ----- */
  it('Pipe return the default value EN for person agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionPerson))
    .toBe('Köhler, Peter Thomas (en)');
  });

  it('Pipe return the default value FR for person agent', () => {
    translateService.currentLang = 'fr';
    expect(contributionFormatPipe.transform(contributionPerson))
    .toBe('Köhler, Peter T (fr)');
  });

  it('Pipe return the fallback value FR for person agent', () => {
    translateService.currentLang = 'de';
    expect(contributionFormatPipe.transform(contributionPerson))
    .toBe('Köhler, Peter T (fr)');
  });

  it('Pipe return the value EN with role for person agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionPerson, true))
    .toBe('Köhler, Peter Thomas (en) <span class="text-secondary">(cre)<span>');
  });

  it('Pipe return the value EN with roles for person agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionMultipleRolesPerson, true))
    .toBe('Köhler, Peter Thomas (en) <span class="text-secondary">(cre, con)<span>');
  });

  it('Pipe return the value EN with fallback EN for person agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionPerson, false, 'en'))
    .toBe('Köhler, Peter Thomas (en)');
  });

  it('Pipe return the preferred value for person agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionPreferredPerson))
    .toBe('Köhler, Peter Thomas (en)');
  });


  /* ----- Organisation ----- */
  it('Pipe return the default value EN for organisation agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (en)');
  });

  it('Pipe return the default value FR for organisation agent', () => {
    translateService.currentLang = 'fr';
    expect(contributionFormatPipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (fr)');
  });

  it('Pipe return the default value FR for organisation agent', () => {
    translateService.currentLang = 'de';
    expect(contributionFormatPipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (fr)');
  });

  it('Pipe return the fallback value EN for organisation agent', () => {
    translateService.currentLang = 'de';
    expect(contributionFormatPipe.transform(contributionOrganisation, false, 'en'))
    .toBe('Vita et Pax Foundation (en)');
  });

  it('Pipe return the preferred value for organisation agent', () => {
    translateService.currentLang = 'en';
    expect(contributionFormatPipe.transform(contributionPreferredOrganisation))
    .toBe('Vita et Pax Foundation');
  });
});
