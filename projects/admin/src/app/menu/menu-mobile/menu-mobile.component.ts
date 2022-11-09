/*
 * RERO ILS UI
 * Copyright (C) 2020-2022 RERO
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
import { MenuService } from '../service/menu.service';

@Component({
  selector: 'admin-menu-mobile',
  templateUrl: './menu-mobile.component.html'
})
export class MenuMobileComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Menu application */
  menuApp: MenuItemInterface;
  /** Menu user */
  menuUser: MenuItemInterface;
  /** Menu Languages */
  menuLanguages: MenuItemInterface;

  // GETTER & SETTER ==========================================================
  /** Menu libraries switch */
  get menuLibrariesSwitch() {
    return this._librarySwitchMenuService.menu;
  }

  /** Menu libraries switch is visible */
  get librariesSwitchIsVisible() {
    return this._librarySwitchMenuService.visible;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _menuService - MenuService
   * @param _librarySwitchMenuService - LibrarySwitchMenuService
   */
  constructor(
    private _menuService: MenuService,
    private _librarySwitchMenuService: LibrarySwitchMenuService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    // Menu application
    this._menuService.appMenu$.subscribe((menu: MenuItemInterface) => this.menuApp = menu);
    if (!this.menuApp) {
      this._menuService.generateAppMenu();
    }
    // Menu user
    this._menuService.userMenu$.subscribe((menu: MenuItemInterface) => this.menuUser = menu);
    if (!this.menuUser) {
      this._menuService.generateUserMenu();
    }
    // Menu language
    this._menuService.languageMenu$.subscribe((menu: MenuItemInterface) => this.menuLanguages = menu);
    if (!this.menuLanguages) {
      this._menuService.generateLanguageMenu();
    }
  }
}
