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

import { ILibrarySwitchDataStorage, LibrarySwitchStorageService } from './library-switch-storage.service';
import { LocalStorageService } from '@rero/ng-core';

describe('LibrarySwitchStorageService', () => {
  let service: LibrarySwitchStorageService;

  const data: ILibrarySwitchDataStorage = {
    userId: 1,
    currentLibrary: 'library',
    libraryName: 'library name'
  };

  const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['has', 'get', 'set', 'remove']);
  localStorageSpy.has.and.returnValue(true);
  localStorageSpy.get.and.returnValue(data);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    });
    service = TestBed.inject(LibrarySwitchStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if the value exists in the storage', () => {
    expect(service.has()).toBeTruthy();
  });

  it('should return the contents of the storage', () => {
    expect(service.get()).toEqual(data);
  });

  it('should save the data', () => {
    expect(service.save(data)).toBe(void 0);
  });

  it('should delete the data', () => {
    expect(service.remove()).toBe(void 0);
  });

});
