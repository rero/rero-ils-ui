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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserApiService } from '../api/user-api.service';
import { LoggedUserService } from './logged-user.service';

describe('Service: LoggedUser', () => {

  let loggedUserService: LoggedUserService;

  const record = {
    medatadata: { pid: 1 },
    settings: { language: 'fr' }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(record));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        LoggedUserService,
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
    loggedUserService = TestBed.inject(LoggedUserService);
  });

  it('should create a logged user service', () => {
    expect(loggedUserService).toBeTruthy();
  });

  it('should return true on the loaded', () => {
    loggedUserService.load();
    expect(loggedUserService.loaded).toBeTruthy();
  });

  it('Should return the data of the logged user', () => {
    loggedUserService.onLoggedUserLoaded$.subscribe((data: any) => {
      expect(data).toEqual(record);
    });
    loggedUserService.load();
  });
});
