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
import { CoreConfigService, MenuFactory, MenuItem, MenuItemInterface } from '@rero/ng-core';
import { MenuBase } from './menu-base';

@Injectable({
  providedIn: 'root'
})
export class MenuLanguageService extends MenuBase {

  /** Menu */
  private _menu: MenuItemInterface = null;

  /** Language menu */
  private _languageMenu: MenuItemInterface;

  /**
   * Languages menu
   * @return MenuItemInterface
   */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _configService - CoreConfigService
   * @param _translateService - TranslateService
   */
  constructor(
    private _configService: CoreConfigService,
    private _translateService: TranslateService
  ) {
    super(_translateService);
    this._initObservable();
  }

  /** Generate */
  generate(): void {
    const factory = new MenuFactory();
    const menu = factory.createItem('UI Languages menu');

    this._languagesMenu(menu);
    this._menu = menu;
  }

  /**
   * Languages menu
   * @param menu - MenuItemInterface
   */
  private _languagesMenu(menu: MenuItemInterface): void {
    const currentLang = this._translateService.currentLang;
    this._languageMenu = menu.addChild(`ui_language_${currentLang}`)
    .setAttribute('class', 'dropdown-menu dropdown-menu-right')
    .setAttribute('id', 'language-menu')
    .setExtra('iconClass', 'fa fa-language');
    this._languageMenu.setName(
      this._translateService.instant(`ui_language_${currentLang}`)
    );

    this._configService.languages.sort().some(lang => {
      const languageMenu = this._languageMenu.addChild(`ui_language_${lang}`)
      .setAttribute('id', `language-menu-${lang}`)
      .setExtra('language', lang)
      .setExtra('iconClass', 'fa fa-language');
      this._translatedName(languageMenu, `ui_language_${lang}`);
    });
  }

  /** Init observable */
  private _initObservable(): void {
    this._translateService.onLangChange
    .subscribe((translate: { lang: string, translations: object }) => {
      this._languageMenu.setName(
        this._translateService.instant(`ui_language_${translate.lang}`)
      );
    });
  }
}
