// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '@rero/ng-core';

export type ILibrarySwitchDataStorage = {
  userId: number;
  currentLibrary: string;
  libraryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchStorageService {

  private localStorage: LocalStorageService = inject(LocalStorageService);

  static readonly STORAGE_KEY = 'menu_library';

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
