/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { ISwitchLibrary, LibraryService } from './library.service';
import { UserService } from '@rero/shared';
import { LibrarySwitchStorageService } from './library-switch-storage.service';

describe('LibraryService', () => {
  let service: LibraryService;

  const userService = {
    user: {
      id: 1,
      currentLibrary: '0'
    }
  };

  const librarySwitchData: ISwitchLibrary = {
    pid: '1',
    code: 'AI-HAD',
    name : 'Library name'
  };

  const librarySwitchStorageServiceSpy = jasmine.createSpyObj('LibrarySwitchStorageService', ['save']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService },
        { provide: LibrarySwitchStorageService, useValue: librarySwitchStorageServiceSpy }
      ]
    });
    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change library', () => {
    service.switch$.subscribe((library: ISwitchLibrary) => expect(library).toEqual(librarySwitchData));
    service.switch(librarySwitchData);
    expect(userService.user.currentLibrary).toEqual(librarySwitchData.pid);
  });
});
