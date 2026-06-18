// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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

  const localStorageSpy = { has: vi.fn(), get: vi.fn(), set: vi.fn(), remove: vi.fn() };
  localStorageSpy.has.mockReturnValue(true);
  localStorageSpy.get.mockReturnValue(data);

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
