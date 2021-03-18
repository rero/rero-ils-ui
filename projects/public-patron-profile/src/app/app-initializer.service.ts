/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { UserService } from '@rero/shared';
import { PatronProfileMenuService } from 'projects/public-search/src/app/patron-profile/patron-profile-menu.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  /**
   * Constructor
   * @param _userService - UserService
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _userService: UserService,
    private _patronProfileMenuService: PatronProfileMenuService
  ) { }

  /** Load */
  load() {
    return new Promise((resolve) => {
      this._patronProfileMenuService.init();
      this._userService.load();
      resolve(true);
    });
  }
}
