/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { NavigationStart, Router } from '@angular/router';
import { LocalStorageService } from '@rero/ng-core';
import { filter } from 'rxjs/operators';
import { User } from '../class/user';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AppRouterEventService {

  /**
   * Constructor
   * @param _router - Router
   * @param _localeStorage - LocalStorageService
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private _router: Router,
    private _localeStorage: LocalStorageService,
    private _appConfigService: AppConfigService
  ) { }

  /** Initialize event */
  initializeEvents() {
    this.eventNavigationStart();
  }

  /**
   * Initialize the filter to detect the start of navigation
   * Storage session expire time in localeStorage
   */
  private eventNavigationStart() {
    this._router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (
        event instanceof NavigationStart
        && this._localeStorage.has(User.STORAGE_KEY)
      ) {
        if (this._localeStorage.isExpired(
          User.STORAGE_KEY,
          this._appConfigService.sessionExpiredSeconds)
        ) {
          this._localeStorage.remove(User.STORAGE_KEY);
        } else {
          this._localeStorage.updateDate(User.STORAGE_KEY);
        }
      }
    });
  }
}
