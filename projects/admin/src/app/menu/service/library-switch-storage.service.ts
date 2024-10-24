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
import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '@rero/ng-core';

export interface ILibrarySwitchDataStorage {
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
