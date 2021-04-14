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
import { TestBed } from '@angular/core/testing';
import { testUserPatronWithSettings } from '../../tests/user';
import { AppSettingsService, ISettings } from './app-settings.service';

describe('ApplicationSettingsService', () => {
  const settings: ISettings = testUserPatronWithSettings.settings;
  let service: AppSettingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an error if the settings are not present', () => {
    try {
      const url = service.baseUrl;
    } catch (e) {
      expect(e.message).toEqual('Set settings before call function.');
    }
  });

  it('should return the values of the configs', () => {
    service.settings = settings;
    expect(service.settings).toEqual(settings);
  });

  it('should return the parameter base url', () => {
    service.settings = settings;
    expect(service.baseUrl).toEqual(settings.baseUrl);
  });

  it('should return the parameter contribution sources', () => {
    service.settings = settings;
    expect(service.contributionSources).toEqual(settings.contributionSources);
  });

  it('should return the parameter contributions agent types', () => {
    service.settings = settings;
    expect(service.contributionAgentTypes).toEqual(settings.contributionAgentTypes);
  });

  it('should return the parameter contributions label order', () => {
    service.settings = settings;
    expect(service.contributionsLabelOrder).toEqual(settings.contributionsLabelOrder);
  });

  it('should return the parameter global view', () => {
    service.settings = settings;
    expect(service.globalViewCode).toEqual(settings.globalView);
  });

  it('should return the parameter language', () => {
    service.settings = settings;
    expect(service.currentLanguage).toEqual(settings.language);
  });

  it('should return the parameter language', () => {
    service.settings = settings;
    expect(service.operationLogs).toEqual(settings.operationLogs);
  });

  it('should return the parameter librarian roles', () => {
    service.settings = settings;
    expect(service.librarianRoles).toEqual(settings.librarianRoles);
  });

  it('should return the parameter current view code', () => {
    service.currentViewCode = 'blabla';
    expect(service.currentViewCode).toEqual('blabla');
  });
});
