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

import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemInterface } from '@rero/ng-core';
import { LibrarySwitchMenuStorageService } from '../service/library-switch-menu-storage.service';
import { MenuUserService } from '../service/menu-user.service';

@Component({
  selector: 'admin-menu-user',
  templateUrl: './menu-user.component.html'
})
export class MenuUserComponent implements OnInit {

  /** User menu */
  private _menu: MenuItemInterface;

  /** Get languages menu */
  get menu() {
    return this._menu;
  }

  /**
   * Constructor
   * @param _menuUserService - MenuUserService
   * @param _librarySwitchMenuStorageService - LibrarySwitchMenuStorageService
   */
  constructor(
    private _menuUserService: MenuUserService,
    private _librarySwitchMenuStorageService: LibrarySwitchMenuStorageService
  ) { }

  /** Init */
  ngOnInit(): void {
    if (!(this._menuUserService.menu)) {
      this._menuUserService.generate();
    }
    this._menu = this._menuUserService.menu;
  }

  eventMenuClick(event: MenuItem) {
    // If the user logout, we delete the local storage
    if (event.getAttribute('id') === 'logout-menu') {
      this._librarySwitchMenuStorageService.removeStorage();
    }
  }
}
