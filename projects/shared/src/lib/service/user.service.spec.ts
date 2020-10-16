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

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoggedUserService } from './logged-user.service';
import { SharedConfigService } from './shared-config.service';
import { UserService } from './user.service';

const record = {
  metadata: {
    pid: 1,
    roles: ['librarian'],
    library: {
      pid: 4
    }
  },
  settings: {}
};

const loggedUserServiceSpy = jasmine.createSpyObj('LoggedUserService', ['']);
loggedUserServiceSpy.onLoggedUserLoaded$ = of(record);

const sharedConfigServiceSpy = jasmine.createSpyObj('SharedConfigService', ['']);
sharedConfigServiceSpy.adminRoles = ['librarian', 'system_librarian'];

describe('Service: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: LoggedUserService, useValue: loggedUserServiceSpy },
        { provide: SharedConfigService, useValue: sharedConfigServiceSpy },
      ]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
