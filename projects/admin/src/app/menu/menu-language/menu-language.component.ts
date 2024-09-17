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
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemInterface } from '@rero/ng-core';
import { MenuService } from '../service/menu.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-menu-language',
  templateUrl: './menu-language.component.html'
})
export class MenuLanguageComponent implements OnInit {

  /** Language menu */
  menu: MenuItemInterface;

  /**
   * Constructor
   * @param _menuService - MenuService
   * @param _translateService - TranslateService
   * @param _httpClient - HttpClient
   */
  constructor(
    private _menuService: MenuService,
    private _translateService: TranslateService,
    private _httpClient: HttpClient
  ) { }

  /** Init */
  ngOnInit(): void {
    this._menuService.languageMenu$.subscribe((menu: MenuItemInterface) => this.menu = menu);
    if (!this.menu) {
      this._menuService.generateLanguageMenu();
    }
  }

  /**
   * Change language
   * @param event: MenuItem
   */
  changeLang(event: MenuItem) {
    const lang = event.getExtra('language');
    this._httpClient.post('/language', {lang}).subscribe(() =>
      this._translateService.use(lang)
    );
  }
}
