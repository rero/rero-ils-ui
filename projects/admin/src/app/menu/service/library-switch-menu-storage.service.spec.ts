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
import { CoreModule, LocalStorageService } from '@rero/ng-core';
import { testUserLibrarianWithSettings, User, UserService } from '@rero/shared';

import { LibrarySwitchMenuStorageService } from './library-switch-menu-storage.service';
import { LibrarySwitchService } from './library-switch.service';

describe('LibrarySwitchMenuStorageService', () => {
  let service: LibrarySwitchMenuStorageService;
  let localStorageService: LocalStorageService;
  let librarySwitchService: LibrarySwitchService;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
    const user = new User(testUserLibrarianWithSettings);
    user.currentLibrary = '2';
    userServiceSpy.user = user;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        LibrarySwitchService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(LibrarySwitchMenuStorageService);
    localStorageService = TestBed.inject(LocalStorageService);
    librarySwitchService = TestBed.inject(LibrarySwitchService);
    localStorageService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return the user\'s current library', () => {
    expect(service.getCurrentLibrary()).toEqual('2');
  });

  it('Should return the user\'s new current library after a switch', () => {
    librarySwitchService.librarySwitch$.subscribe(() => {
      expect(service.getCurrentLibrary()).toEqual('4');
    });
    librarySwitchService.switch('4');
  });
});
