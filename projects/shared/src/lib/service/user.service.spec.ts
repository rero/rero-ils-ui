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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testPatronLibrarianRoles, testUserLibrarianWithSettings, testUserPatronLibrarian } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { testUserPatronWithSettings } from '../../tests/user';
import { UserApiService } from '../api/user-api.service';
import { User } from '../class/user';
import { AppSettingsService } from './app-settings.service';
import { IUserLocaleStorage, UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let appSettingsService: AppSettingsService;

  const dataStorage = new User(testUserPatronLibrarian, testPatronLibrarianRoles);
  dataStorage.currentLibrary = '1';
  dataStorage.currentOrganisation = 'org1';

  const dataResultStorage: IUserLocaleStorage = {
    id: dataStorage.id,
    currentLibrary: dataStorage.currentLibrary,
    currentOrganisation: dataStorage.currentOrganisation
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep((testUserLibrarianWithSettings))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    appSettingsService = TestBed.inject(AppSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user and settings separately', () => {
    service.loaded$.subscribe((user: User) => {
      expect(user instanceof User).toBeTruthy();
      const appSettings = JSON.stringify(appSettingsService.settings);
      const recordSettings = JSON.stringify(testUserLibrarianWithSettings.settings);
      expect(appSettings === recordSettings).toBeTruthy();
      expect(user.currentLibrary === testUserLibrarianWithSettings.patrons[0].libraries[0].pid);
      expect(user.currentOrganisation === testUserLibrarianWithSettings.patrons[0].libraries[0].organisation.pid);
    });
    service.load();
  });

  it('should return a boolean on the hasOnLocaleStorage function', () => {
    service.clearOnLocaleStorage();
    expect(service.hasOnLocaleStorage()).toBeFalsy();
    service.setOnLocaleStorage(dataStorage);
    expect(service.hasOnLocaleStorage()).toBeTruthy();
  });

  it('should return an object of the stored parameters', () => {
    service.clearOnLocaleStorage();
    service.setOnLocaleStorage(dataStorage);
    expect(service.getOnLocaleStorage()).toEqual(dataResultStorage);
  });
});
