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
import { testUserPatronWithSettings } from '../../tests/user';
import { AppSettingsService } from '../service/app-settings.service';
import { ContributionTypePipe } from './contribution-type.pipe';

describe('Pipe: ContributionType', () => {

  let contributionTypePipe: ContributionTypePipe;
  let appSettingsService: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContributionTypePipe
      ]
    });
    contributionTypePipe = TestBed.inject(ContributionTypePipe);
    appSettingsService = TestBed.inject(AppSettingsService);
    appSettingsService.settings = testUserPatronWithSettings.settings;
  });

  it('create an instance', () => {
    expect(contributionTypePipe).toBeTruthy();
  });

  it('should return the type of contribution', () => {
    expect(contributionTypePipe.transform('bf:Person')).toEqual('persons');
  });
});
