/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { inject, Injectable } from '@angular/core';
import { LibraryService } from '@app/admin/menu/service/library.service';
import { MenuService } from '@app/admin/menu/service/menu.service';
import { LocalStorageService } from '@rero/ng-core';

@Injectable({
  providedIn: 'root'
})
export class LoanFixedDateService {

  private localeStorageService: LocalStorageService = inject(LocalStorageService);
  private libraryService: LibraryService = inject(LibraryService);
  private menuService: MenuService = inject(MenuService);

  /** The key to local Storage */
  private _dueDateKey: string = 'due_date_remember';

  /** Expiration 12 hours (definition in seconds) */
  private _keyExpiration: number = 43200;

  constructor() {
    this.init();
  }

  /**
   * Test the existence of the value in locale storage
   * @returns true if the value exists
   */
  hasValue(): boolean {
    return this.localeStorageService.has(this._dueDateKey);
  }

  /**
   * Save value in locale storage
   * @param value - Date in string format
   */
  set(value: string): void {
    this.localeStorageService.set(this._dueDateKey, value);
  }

  /**
   * Getting the date from locale storage
   * @returns The date in string format or null
   */
  get(): string | null {
    // We have a value in local storage
    if (this.localeStorageService.has(this._dueDateKey)) {
      if (this.localeStorageService.isExpired(this._dueDateKey, this._keyExpiration)) {
        this.remove();
      } else {
        const endDate = this.localeStorageService.get(this._dueDateKey);
        // We compare the retrieved date with today's date
        const endDay = new Date(new Date(endDate).toDateString()).getTime();
        const now = new Date(new Date().toDateString()).getTime();
        if (endDay >= now) {
          return endDate;
        }
        // If the date is lower, we delete it.
        this.remove();
      }
    }
  }

  /**
   * Remove value in locale storage
   */
  remove(): void {
    this.localeStorageService.remove(this._dueDateKey);
  }

  /**
   * Init service
   * Connecting the library change service
   */
  init(): void {
    // We delete the stored value if we change library
    this.libraryService.switch$.subscribe(() => this.remove());
    // Delete locale storage on logout
    this.menuService.logout$.subscribe(() => this.remove());
  }
}
