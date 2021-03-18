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
import { TranslateService } from '@ngx-translate/core';
import { MenuFactory, MenuItemInterface } from '@rero/ng-core';
import { User, UserService } from '@rero/shared';
import { MenuBase } from './menu-base';

@Injectable({
  providedIn: 'root'
})
export class MenuUserService extends MenuBase {

  /** Menu */
  private _menu: MenuItemInterface = null;

  /** User */
  private _user: User;

  /**
   * User service menu
   * @return MenuItemInterface
   */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _userService - UserService
   */
  constructor(
    private _translateService: TranslateService,
    private _userService: UserService
    ) {
      super(_translateService);
    }

  /** Generate */
  generate() {
    this._user = this._userService.user;
    const factory = new MenuFactory();
    const menu = factory.createItem('UI User menu');

    this._userMenu(menu);
    this._menu = menu;
  }

  /**
   * User menu
   * @param menu - MenuItemInterface
   */
  private _userMenu(menu: MenuItemInterface): void {
    const userMenu = menu.addChild(this._user.symbolName)
    .setAttribute('class', 'dropdown-menu dropdown-menu-right')
    .setAttribute('id', 'my-account-menu')
    .setExtra('iconClass', 'fa fa-user');

    // ----- PUBLIC INTERFACE
    const publicInterfaceMenu = userMenu.addChild('Public interface')
    .setUri('/')
    .setAttribute('id', 'public-interface-menu')
    .setExtra('iconClass', 'fa fa-television');
    this._translatedName(publicInterfaceMenu, 'Public interface');

    // ----- LOGOUT
    const logoutMenu = userMenu.addChild('Logout')
    .setUri('/signout')
    .setAttribute('id', 'logout-menu')
    .setExtra('iconClass', 'fa fa-sign-out');
    this._translatedName(logoutMenu, 'Logout');
  }
}
