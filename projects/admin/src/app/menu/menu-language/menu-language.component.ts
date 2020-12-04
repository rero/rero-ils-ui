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
import { MenuItem, MenuItemInterface, TranslateService } from '@rero/ng-core';
import { MenuLanguageService } from '../service/menu-language.service';

@Component({
  selector: 'admin-menu-language',
  templateUrl: './menu-language.component.html'
})
export class MenuLanguageComponent implements OnInit {

  /** User menu */
  private _menu: MenuItemInterface;

  /**
   * Language menu
   * @return MenuItemInterface
   */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _menuLanguageService - MenuLanguageService
   * @param _translateService - TranslateService
   */
  constructor(
    private _menuLanguageService: MenuLanguageService,
    private _translateService: TranslateService
  ) { }

  /** Init */
  ngOnInit(): void {
    if (!(this._menuLanguageService.menu)) {
      this._menuLanguageService.generate();
    }
    this._menu = this._menuLanguageService.menu;
  }

  /**
   * Change language
   * @param event: MenuItem
   */
  changeLang(event: MenuItem) {
    this._translateService.setLanguage(event.getExtra('language'));
  }
}
