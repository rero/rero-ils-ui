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


import { TestBed } from '@angular/core/testing';
import { SharedConfigService } from '../service/shared-config.service';
import { ContributionTypePipe } from './contribution-type.pipe';

describe('Pipe: ContributionType', () => {

  let contributionTypePipe: ContributionTypePipe;

  const sharedConfigServiceSpy = jasmine.createSpyObj('SharedConfigService', ['']);
  sharedConfigServiceSpy.contributionAgentTypes = {
    'bf:person': 'Person',
    'bf:Organisation': 'Organisation'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContributionTypePipe,
        { provide: SharedConfigService, useValue: sharedConfigServiceSpy }
      ]
    });
    contributionTypePipe = TestBed.get(ContributionTypePipe);
  });

  it('create an instance', () => {
    expect(contributionTypePipe).toBeTruthy();
  });

  it('should return the type of contribution', () => {
    expect(contributionTypePipe.transform('bf:person')).toEqual('Person');
  });
});
