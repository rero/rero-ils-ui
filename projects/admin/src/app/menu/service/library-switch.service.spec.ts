/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { TranslateModule } from '@ngx-translate/core';
import { testUserLibrarianWithSettings, User, UserService } from '@rero/shared';
import { LibrarySwitchError, LibrarySwitchService } from './library-switch.service';

describe('LibrarySwitchService', () => {
  let service: LibrarySwitchService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  const user = new User(testUserLibrarianWithSettings);
  user.currentLibrary = '2';
  userServiceSpy.user = user;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ]
    });
    service = TestBed.inject(LibrarySwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should raise an exception if the library does not exist', () => {
    expect(function() { service.switch('1') })
      .toThrowError(LibrarySwitchError, 'This library with pid 1 is not available.');
  });

  it('should change library', () => {
    const library = '2';
    service.librarySwitch$
      .subscribe((user: User) => expect(user.currentLibrary).toEqual(library));
      service.switch(library)
  });
});
