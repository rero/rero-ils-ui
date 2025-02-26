/*
 * RERO ILS UI
 * Copyright (C) 2021-2022 RERO
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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { testUserLibrarianWithSettings, testUserPatronLibrarian } from '../../tests/user';
import { UserApiService } from '../api/user-api.service';
import { User } from '../class/user';
import { PERMISSIONS } from '../util/permissions';
import { AppSettingsService } from './app-settings.service';
import { PermissionsService } from './permissions.service';
import { UserService } from './user.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let appSettingsService: AppSettingsService;
  let permissionsService: PermissionsService;

  const dataStorage = new User(testUserPatronLibrarian);
  dataStorage.currentLibrary = '1';
  dataStorage.currentOrganisation = 'org1';

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep((testUserLibrarianWithSettings))));

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(UserService);
    appSettingsService = TestBed.inject(AppSettingsService);
    permissionsService = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user and settings separately', () => {
    service.load().subscribe((user: User) => {
      expect(user instanceof User).toBeTruthy();
      const appSettings = JSON.stringify(appSettingsService.settings);
      const recordSettings = JSON.stringify(testUserLibrarianWithSettings.settings);
      expect(appSettings === recordSettings).toBeTruthy();
      expect(user.currentLibrary === testUserLibrarianWithSettings.patrons[0].libraries[0].pid);
      expect(user.currentOrganisation === testUserLibrarianWithSettings.patrons[0].libraries[0].organisation.pid);
      // Check to see if the permissions service is set up
      expect(permissionsService.canAccess(PERMISSIONS.UI_ACCESS)).toBeTrue();
    });
  });
});
