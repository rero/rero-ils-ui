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
import { LoggedUserService } from '@rero/shared';
import { of } from 'rxjs';
import { UserService } from './user.service';


describe('UserService', () => {
  let service: UserService;
  let loggedUserService: LoggedUserService;

  const userRecord = {
    metadata: {
      pid: '1'
    }
  };
  const loggedUserServiceSpy = jasmine.createSpyObj('LoggedUserService', ['']);
  loggedUserServiceSpy.onLoggedUserLoaded$ = of(userRecord);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: LoggedUserService, useValue: loggedUserServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    loggedUserService = TestBed.inject(LoggedUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user', () => {
    loggedUserService.onLoggedUserLoaded$.subscribe((data: any) => {
      expect(data).toEqual(userRecord);
    });
    service.init();
  });
});
