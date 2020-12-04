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
import { MenuItemInterface, TranslateService } from '@rero/ng-core';
import { MenuItem } from '@rero/ng-core';
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
   * @param _translateService - TranslateService
   */
  constructor(
    private _menuUserService: MenuUserService,
    private _translateService: TranslateService
  ) { }

  /** Init */
  ngOnInit(): void {
    if (!(this._menuUserService.menu)) {
      this._menuUserService.generate();
    }
    this._menu = this._menuUserService.menu;
  }

  /**
   * Change language
   * @param event: MenuItem
   */
  changeLang(event: MenuItem): void {
    this._translateService.setLanguage(event.getExtra('language'));
  }
}
