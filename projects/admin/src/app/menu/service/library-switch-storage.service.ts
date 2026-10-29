// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { LIBRARIAN_STORAGE_KEYS } from '@app/admin/service/librarian-storage-keys';
import { LocalStorageService } from '@rero/ng-core';

export type ILibrarySwitchDataStorage = {
  currentLibrary: string;
  libraryName: string;
};

@Injectable({
  providedIn: 'root',
})
export class LibrarySwitchStorageService {
  private localStorage: LocalStorageService = inject(LocalStorageService);

  static readonly STORAGE_KEY = LIBRARIAN_STORAGE_KEYS.library;

  has(): boolean {
    return this.localStorage.has(LibrarySwitchStorageService.STORAGE_KEY);
  }

  get(): ILibrarySwitchDataStorage {
    return this.localStorage.get(LibrarySwitchStorageService.STORAGE_KEY);
  }

  save(data: ILibrarySwitchDataStorage): void {
    this.localStorage.set(LibrarySwitchStorageService.STORAGE_KEY, data);
  }

  remove(): void {
    this.localStorage.remove(LibrarySwitchStorageService.STORAGE_KEY);
  }
}
