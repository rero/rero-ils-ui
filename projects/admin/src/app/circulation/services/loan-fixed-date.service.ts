/*
 * RERO ILS UI
 * Copyright (C) 2023-2025 RERO
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
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { MenuStore } from '@app/admin/menu/store/menu.store';
import { LocalStorageService } from '@rero/ng-core';

@Injectable({
  providedIn: 'root'
})
export class LoanFixedDateService {

  private localeStorageService: LocalStorageService = inject(LocalStorageService);
  private menuStore = inject(MenuStore);

  private readonly _dueDateKey = 'due_date_remember';
  private readonly _keyExpiration = 43200; // 12 hours in seconds

  private readonly _dueDate = signal<string | undefined>(this._readFromStorage());

  readonly dueDate = this._dueDate.asReadonly();
  readonly hasValue = computed(() => this._dueDate() !== undefined);

  constructor() {
    effect(() => {
      if (this.menuStore.selectedLibrary()) {
        this.remove();
      }
    });

    effect(() => {
      if (this.menuStore.logoutCounter() > 0) {
        this.remove();
      }
    });
  }

  /**
   * Save value in locale storage and update the signal
   * @param value - Date in string format
   */
  set(value: string): void {
    this.localeStorageService.set(this._dueDateKey, value);
    this._dueDate.set(value);
  }

  /**
   * Get the stored date if it is still valid (today or future), otherwise undefined.
   * @returns The date in string format or undefined
   */
  get(): string | undefined {
    const value = this._dueDate();
    if (!value) {
      return undefined;
    }
    const endDay = new Date(new Date(value).toDateString()).getTime();
    const now = new Date(new Date().toDateString()).getTime();
    return endDay >= now ? value : undefined;
  }

  /**
   * Remove value from locale storage and clear the signal
   */
  remove(): void {
    this.localeStorageService.remove(this._dueDateKey);
    this._dueDate.set(undefined);
  }

  /** Read, validate and return the stored date; clears storage if invalid */
  private _readFromStorage(): string | undefined {
    if (!this.localeStorageService.has(this._dueDateKey)) {
      return undefined;
    }
    if (this.localeStorageService.isExpired(this._dueDateKey, this._keyExpiration)) {
      this.localeStorageService.remove(this._dueDateKey);
      return undefined;
    }
    const endDate = this.localeStorageService.get(this._dueDateKey);
    const endDay = new Date(new Date(endDate).toDateString()).getTime();
    const now = new Date(new Date().toDateString()).getTime();
    if (endDay >= now) {
      return endDate;
    }
    this.localeStorageService.remove(this._dueDateKey);
    return undefined;
  }
}
