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
import { MenuItemInterface } from '@rero/ng-core';
import { LibrarySwitchMenuService } from '../service/library-switch-menu.service';
import { MenuLanguageService } from '../service/menu-language.service';
import { MenuUserServicesService } from '../service/menu-user-services.service';
import { MenuUserService } from '../service/menu-user.service';

@Component({
  selector: 'admin-menu-mobile',
  templateUrl: './menu-mobile.component.html'
})
export class MenuMobileComponent implements OnInit {

  /** Menu user */
  private _menuUser: MenuItemInterface;

  /** Menu user services */
  private _menuUserServices: MenuItemInterface;

  /** Menu Languages */
  private _menuLanguages: MenuItemInterface;

  /**
   * Get menu user
   * @return MenuItemInterface
   */
  get menuUser(): MenuItemInterface {
    return this._menuUser;
  }

  /**
   * Get menu user services
   * @return MenuItemInterface
   */
  get menuUserServices(): MenuItemInterface {
    return this._menuUserServices;
  }

  /**
   * Get menu languages
   * @return MenuItemInterface
   */
  get menuLanguages(): MenuItemInterface {
    return this._menuLanguages;
  }

  /** Menu libraries switch */
  get menuLibrariesSwitch() {
    return this._librarySwitchMenuService.menu;
  }

  /** Menu libraries switch is visible */
  get librariesSwitchIsVisible() {
    return this._librarySwitchMenuService.visible;
  }

  /**
   * Constructor
   * @param _menuUserServicesService - MenuUserServicesService
   * @param _menuUserService - MenuUserService
   * @param _menuLanguageService - MenuLanguageService
   * @param _librarySwitchMenuService - LibrarySwitchMenuService
   */
  constructor(
    private _menuUserServicesService: MenuUserServicesService,
    private _menuUserService: MenuUserService,
    private _menuLanguageService: MenuLanguageService,
    private _librarySwitchMenuService: LibrarySwitchMenuService
    ) { }

  ngOnInit(): void {
    // Menu user services
    if (!(this._menuUserServicesService.menu)) {
      this._menuUserServicesService.generate();
    }
    this._menuUserServices = this._menuUserServicesService.menu;
    // Menu user
    if (!(this._menuUserService.menu)) {
      this._menuUserService.generate();
    }
    this._menuUser = this._menuUserService.menu;
    // Menu languages
    if (!(this._menuLanguageService.menu)) {
      this._menuLanguageService.generate();
    }
    this._menuLanguages = this._menuLanguageService.menu;
  }
}
