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
import { TranslateService } from '@rero/ng-core';
import { LoggedUserService, SharedConfigService } from '@rero/shared';
import { UserService } from 'projects/public-search/src/app/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  /**
   * Constructor
   * @param _loggedUserService - LoggedUserService
   * @param _sharedConfigService - SharedConfigService
   * @param _translateService - TranslateService
   * @param _userService - UserService
   */
  constructor(
    private _loggedUserService: LoggedUserService,
    private _sharedConfigService: SharedConfigService,
    private _translateService: TranslateService,
    private _userService: UserService
  ) { }

  /** Load */
  load() {
    this._initiliazeObservable();
    return new Promise((resolve) => {
      this._sharedConfigService.init();
      this._userService.init();
      this._loggedUserService.load();
      resolve(true);
    });
  }

  /** initialize observable */
  private _initiliazeObservable() {
    // Set current language interface
    this._loggedUserService.onLoggedUserLoaded$.subscribe(data => {
      this._translateService.setLanguage(data.settings.language);
    });
  }
}
