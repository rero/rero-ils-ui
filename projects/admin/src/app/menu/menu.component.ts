/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigService, LocalStorageService, RecordService, TranslateService as CoreTranslateService } from '@rero/ng-core';
import { SearchBarConfigService, UserService } from '@rero/shared';
import { MenuService } from '../service/menu.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isCollapsed = true;

  recordTypes = [];

  maxLengthSuggestion = 100;

  linksMenu: any;

  autocompleteQueryParams: any = { page: '1', size: '10' };

  languagesMenu = {};

  userMenu = {
    navCssClass: 'navbar-nav',
    dropdownMenuCssClass: 'dropdown-menu-right',
    entries: []
  };

  get typeaheadOptionsLimit() {
    return this._searchBarConfigService.typeaheadOptionsLimit;
  }

  constructor(
    private _appTranslateService: CoreTranslateService,
    private _translateService: TranslateService,
    private _configService: CoreConfigService,
    private _userService: UserService,
    private _recordService: RecordService,
    private _localeStorageService: LocalStorageService,
    private _menuService: MenuService,
    private _searchBarConfigService: SearchBarConfigService
  ) {}

  ngOnInit() {
    this._initLinksMenu();
    const currentUser = this._userService.user;
    this.autocompleteQueryParams.organisation = currentUser.organisation;

    // first call
    this._initLanguageMenu();
    // change the menu when the language is changing
    this._translateService.onLangChange.subscribe(lang => this._initLanguageMenu());

    this.userMenu.entries.push({
      name: `${currentUser.first_name[0]}${currentUser.last_name[0]}`,
      iconCssClass: 'fa fa-user',
      id: 'my-account-menu',
      entries: [
        {
          name: this._translateService.instant('Public interface'),
          href: '/',
          iconCssClass: 'fa fa-television',
          id: 'public-interface-menu'
        }, {
          name: this._translateService.instant('Logout'),
          href: `/signout`,
          iconCssClass: 'fa fa-sign-out',
          id: 'logout-menu'
        }
      ]
    });

    this.recordTypes = this._searchBarConfigService.getConfig(
      true, this, undefined, this.maxLengthSuggestion
    );

    this._recordService.getRecord('organisations', currentUser.organisation)
      .subscribe(organisation => {
        this.userMenu.entries[0].entries[0].href = `/${organisation.metadata.code}/`;
      });
  }

  /**
   * Populate the language menu given the current language.
   */
  private _initLanguageMenu() {
    const languagesMenu = {
      navCssClass: 'navbar-nav',
      entries: [{
        name: this._translateService.instant('Menu'),
        iconCssClass: 'fa fa-bars',
        id: 'language-menu',
        entries: [{
          name: this._translateService.instant('Help'),
          iconCssClass: 'fa fa-info',
          href: 'https://ils.test.rero.ch/help',
          id: 'help-menu',
        }]
      }]
    };
    const languages = this._configService.languages;
    // divider
    languagesMenu.entries[0].entries.splice(0, 0, {name: null, iconCssClass: null, href: null, id: null});
    for (const lang of languages) {
      if (lang !== this._appTranslateService.currentLanguage) {
        const data: any = {
          // same strategy as rero-ils
          name: `ui_language_${lang}`,
          code: lang,
          iconCssClass: 'fa fa-language',
          id: `language-menu-${lang}`,
        };
        languagesMenu.entries[0].entries.splice(0, 0, data);
      }
    }
    this.languagesMenu = languagesMenu;
  }

  /**
   * Populate the links menu and adds the current library link.
   */
  private _initLinksMenu() {
    this.linksMenu = this._menuService.linksMenu;
    this._localeStorageService.onSet$.subscribe(() => {
      this.linksMenu.entries.find((mainEntry: any) => {
        mainEntry.entries.find(
            (element: any) => {
              // update my library link
              if (element.routerLink.indexOf('/libraries/detail') > -1) {
                element.routerLink = this.myLibraryRouterLink();
              }
              // update library query params
              // TODO : refactoring when all UI menus will be rewritten
              if (element.routerLink.indexOf('/records/items') > -1
               || element.routerLink.indexOf('/records/ill_requests') > -1
               || element.routerLink.indexOf('/records/collections') > -1) {
                element.queryParams = this.myLibraryQueryParams();
              }
            }
          );
      });
    });
  }

  changeLang(item) {
    this._appTranslateService.setLanguage(item.code);
    this._initLinksMenu();
  }

  private myLibraryRouterLink() {
    return `/records/libraries/detail/${this._userService.user.currentLibrary}`;
  }

  /**
   * Query param to filter resource by current logges user library
   * @return library pid as a dictionary
   */
  private myLibraryQueryParams() {
    return {library: this._userService.user.currentLibrary};
  }
}
