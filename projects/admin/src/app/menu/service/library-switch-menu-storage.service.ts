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
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@rero/ng-core';
import { User, UserService } from '@rero/shared';
import { LibrarySwitchService } from './library-switch.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchMenuStorageService {

  /** Storage name */
  private STORAGE_KEY = 'menu_current_library';

  /**
   * Constructor
   * @param _librarySwitchService - LibrarySwitchService
   * @param _localeStorageService - LocalStorageService
   * @param _userService - UserService
   */
  constructor(
    private _librarySwitchService: LibrarySwitchService,
    private _localeStorageService: LocalStorageService,
    private _userService: UserService
  ) {
    this._initObservable();
   }

   /**
    * Get current library
    * @returns current selected library in storage
    */
  getCurrentLibrary(): string {
    // If I have no active storage, I store the current library key locally
    const user = this._userService.user;
    let dataStorage = null;
    if (!this._localeStorageService.has(this.STORAGE_KEY)) {
      dataStorage = this._dataStorage(user);
      this._localeStorageService.set(this.STORAGE_KEY, dataStorage);
    } else {
      // If I have an active key, I retrieve it and assign it to the current user's library
      dataStorage = this._localeStorageService.get(this.STORAGE_KEY);
      // If the user is no longer the same, we delete the local storage
      if (dataStorage.userId !== this._userService.user.id) {
        dataStorage = this._dataStorage(user);
        this._localeStorageService.set(this.STORAGE_KEY, dataStorage);
      }
      // Set the new current library on user
      this._userService.user.currentLibrary = dataStorage.currentLibrary;
    }
    return this._userService.user.currentLibrary;
  }

  /** Remote current library storage */
  removeStorage(): void {
    this._localeStorageService.remove(this.STORAGE_KEY);
  }

  /**
   * User data storage
   * @returns Object
   */
  private _dataStorage(user: User): object {
    return {
      userId: user.id,
      currentLibrary: user.currentLibrary
    };
  }

  /** Initialize observable */
  private _initObservable(): void {
    this._librarySwitchService.librarySwitch$.subscribe((user: User) => {
      this._localeStorageService.set(this.STORAGE_KEY, this._dataStorage(user));
    });
  }
}
