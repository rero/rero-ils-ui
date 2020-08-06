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
import { TranslateService } from '@ngx-translate/core';

let translateServiceMock: TranslateServiceMock;

let contributionFormatPipe: ContributionFormatPipe;

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

class TranslateServiceMock {

  language = 'en';

  setCurrentLanguage(lang: string) {
    this.language = lang;
  }

  get currentLang(): string {
    return this.language;
  }

  instant(value: string): string {
    return value;
  }
}

describe('Pipe: ContributionFormate', () => {
  beforeEach(() => {
    translateServiceMock = new TranslateServiceMock();
    contributionFormatPipe = new ContributionFormatPipe(
      translateServiceMock  as unknown as TranslateService
    );
  });

  it('create an instance', () => {
    const pipe = contributionFormatPipe;
    expect(pipe).toBeTruthy();
  });

  /* ----- Person ----- */
  it('Pipe return the default value EN for person agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPerson))
    .toBe('Köhler, Peter Thomas (en)');
  });

  it('Pipe return the default value FR for person agent', () => {
    translateServiceMock.setCurrentLanguage('fr');
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPerson))
    .toBe('Köhler, Peter T (fr)');
  });

  it('Pipe return the fallback value FR for person agent', () => {
    translateServiceMock.setCurrentLanguage('de');
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPerson))
    .toBe('Köhler, Peter T (fr)');
  });

  it('Pipe return the value EN with role for person agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPerson, true))
    .toBe('Köhler, Peter Thomas (en) <span class="text-secondary">(cre)<span>');
  });

  it('Pipe return the value EN with roles for person agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionMultipleRolesPerson, true))
    .toBe('Köhler, Peter Thomas (en) <span class="text-secondary">(cre, con)<span>');
  });

  it('Pipe return the value EN with fallback EN for person agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPerson, false, 'en'))
    .toBe('Köhler, Peter Thomas (en)');
  });

  it('Pipe return the preferred value for person agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPreferredPerson))
    .toBe('Köhler, Peter Thomas (en)');
  });


  /* ----- Organisation ----- */
  it('Pipe return the default value EN for organisation agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (en)');
  });

  it('Pipe return the default value FR for organisation agent', () => {
    translateServiceMock.setCurrentLanguage('fr');
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (fr)');
  });

  it('Pipe return the default value FR for organisation agent', () => {
    translateServiceMock.setCurrentLanguage('de');
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionOrganisation))
    .toBe('Vita et Pax Foundation (fr)');
  });

  it('Pipe return the fallback value EN for organisation agent', () => {
    translateServiceMock.setCurrentLanguage('de');
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionOrganisation, false, 'en'))
    .toBe('Vita et Pax Foundation (en)');
  });

  it('Pipe return the preferred value for organisation agent', () => {
    const pipe = contributionFormatPipe;
    expect(pipe.transform(contributionPreferredOrganisation))
    .toBe('Vita et Pax Foundation');
  });
});
