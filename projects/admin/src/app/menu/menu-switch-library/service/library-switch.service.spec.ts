/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { RouterTestingModule } from '@angular/router/testing';
import { User, UserService } from '@rero/shared';
import { LibrarySwitchService, LibrarySwitchError } from './library-switch.service';

describe('LibrarySwitchService', () => {

  let librarySwitchService: LibrarySwitchService;

  const user = new User({
    roles: ['librarian'],
    currentLibrary: 1,
    libraries: [
      {
        pid: 1,
        organisation: {
          pid: 1
        }
      },
      {
        pid: 2,
        organisation: {
          pid: 2
        }
      }
    ]
  });

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = user;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    librarySwitchService = TestBed.get(LibrarySwitchService);
  });

  it('should be created', () => {
    expect(librarySwitchService).toBeTruthy();
  });

  it('should be able to switch libraries', () => {
    if (user.hasRole('system_librarian')) {
      user.roles = user.roles.filter(role => role !== 'system_librarian');
    }
    librarySwitchService.librarySwitch$.subscribe((u: User) => {
      expect(u.currentLibrary).toEqual('2');
    });
    librarySwitchService.switch('2');
  });

  it('should be able to switch libraries (system librarian).', () => {
    user.roles.push('system_librarian');
    librarySwitchService.librarySwitch$.subscribe((u: User) => {
      expect(u.currentLibrary).toEqual('4');
    });
    librarySwitchService.switch('4');
  });

  it('should have an exception if the library does not exist in the list (librarian).', () => {
    expect(() => {
      librarySwitchService.switch('3');
    }).toThrowError(LibrarySwitchError);
  });
});
