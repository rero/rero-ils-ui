/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { CoreConfigService, MenuFactory, MenuItemInterface } from '@rero/ng-core';
import { Observable, Subject } from 'rxjs';
import { MENU_APP } from '../menu-definition/menu-app';
import { MENU_USER } from '../menu-definition/menu-user';
import { LibrarySwitchService } from './library-switch.service';
import { MenuFactoryService } from './menu-factory.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // SERVICE ATTRIBUTES =======================================================
  /** Application menu */
  private _appMenu: Subject<MenuItemInterface> = new Subject();
  /** User menu */
  private _userMenu: Subject<MenuItemInterface> = new Subject();
  /** Language menu */
  private _languageMenu: Subject<MenuItemInterface> = new Subject();

  // GETTER & SETTER ==========================================================
  /**
   * Get the main application menu
   * @return Observable on parent menuItem interface.
   */
  get appMenu$(): Observable<MenuItemInterface> {
    return this._appMenu;
  }

  /**
   * Get the user application menu
   * @return Observable on parent menuItem interface.
   */
  get userMenu$(): Observable<MenuItemInterface> {
    return this._userMenu;
  }

  /**
   * Get the language application menu
   * @return Observable on parent menuItem interface.
   */
  get languageMenu$(): Observable<MenuItemInterface> {
    return this._languageMenu;
  }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _menuFactoryService - MenuFactoryService
   * @param _translateService - TranslateService
   * @param _librarySwitchService - LibrarySwitchService
   * @param _configService - CoreConfigService
   */
  constructor(
    private _menuFactoryService: MenuFactoryService,
    private _translateService: TranslateService,
    private _librarySwitchService: LibrarySwitchService,
    private _configService: CoreConfigService
  ) {
    this._initializeObservable();
  }

  // SERVICE FUNCTIONS ========================================================
  /** Generate application menu */
  generateAppMenu(): void {
    this._appMenu.next(this._menuFactoryService.create('UI Main menu', MENU_APP));
  }

  /** Generate User menu */
  generateUserMenu(): void {
    this._userMenu.next(this._menuFactoryService.create('UI User menu', MENU_USER))
  }

  generateLanguageMenu(): void {
    this._languageMenu.next(this._languageMenuFactory());
  }

  /** Generate all menus */
  generateMenus(): void {
    this.generateAppMenu();
    this.generateUserMenu();
    this.generateLanguageMenu();
  }

  // SERVICE PRIVATE FUNCTIONS ================================================
  /** Language menu */
  private _languageMenuFactory(): MenuItemInterface {
    const factory = new MenuFactory();
    const menu = factory.createItem('UI Languages menu');
    const currentLang = this._translateService.currentLang;
    const languageMenu = menu.addChild(`ui_language_${currentLang}`)
      .setName(this._translateService.instant(`ui_language_${currentLang}`))
      .setAttribute('class', 'dropdown-menu dropdown-menu-right')
      .setAttribute('id', 'language-menu')
      .setExtra('iconClass', 'fa fa-language');

    this._configService.languages.sort().some(lang => {
      languageMenu.addChild(`ui_language_${lang}`)
        .setName(this._translateService.instant(`ui_language_${lang}`))
        .setAttribute('id', `language-menu-${lang}`)
        .setExtra('language', lang)
        .setExtra('iconClass', 'fa fa-language');
    });
    return menu;
  }

  /** Connect observables */
  private _initializeObservable(): void {
    this._librarySwitchService.librarySwitch$.subscribe(() => this.generateMenus());
    this._translateService.onLangChange.subscribe(() => this.generateMenus());
  }
}
