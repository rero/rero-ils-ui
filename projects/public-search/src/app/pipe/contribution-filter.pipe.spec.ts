/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { ContributionFilterPipe } from './contribution-filter.pipe';

describe('ContributionFilterPipe', () => {
  const pipe = new ContributionFilterPipe();

  const contributions = [{
    agent: {
      pid: 1,
      type: 'bf:Person',
      authorized_access_point_en: 'contribution EN',
      authorized_access_point_fr: 'contribution FR'
    },
    role: 'author'
  }];

  const contributionsResultsEn = [{
    authorizedAccessPoint: 'contribution EN',
    pid: 1,
    type: 'bf:Person',
    role: 'author',
    target: 'persons'
  }];

  const contributionsResultsFr = [{
    authorizedAccessPoint: 'contribution FR',
    pid: 1,
    type: 'bf:Person',
    role: 'author',
    target: 'persons'
  }];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should extract the right contributor (default language)', () => {
    expect(pipe.transform(contributions)).toEqual(contributionsResultsEn);
  });

  it('should extract the right contributor (language: french)', () => {
    expect(pipe.transform(contributions, 'fr')).toEqual(contributionsResultsFr);
  });

  it('should extract the right contributor in english if language does not exists', () => {
    expect(pipe.transform(contributions, 'de')).toEqual(contributionsResultsEn);
  });
});
