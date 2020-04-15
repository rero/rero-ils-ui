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
import { CoreConfigService, LocalStorageService, RecordService, TranslateService as CoreTranslateService } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { LibrarySwitchService } from '../service/library-switch.service';
import { MainTitlePipe } from '../pipe/main-title.pipe';
import { MenuService } from '../service/menu.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MainTitlePipe]
})
export class MenuComponent implements OnInit {
  isCollapsed = true;
  lang: string = document.documentElement.lang;
  languages: string[];

  recordTypes = [];

  maxLengthSuggestion = 100;

  linksMenu: any;

  autocompleteQueryParams: any = {page: '1', size: '10'};

  librariesSwitchMenu = {
    navCssClass: 'navbar-nav',
    entries: [{
      name: this._translateService.instant('Switch library'),
      iconCssClass: 'fa fa-random',
      entries: []
    }]
  };

  languagesMenu = {
    navCssClass: 'navbar-nav',
    entries: [{
      name: this._translateService.instant('Menu'),
      iconCssClass: 'fa fa-bars',
      entries: [{
        name: this._translateService.instant('Help'),
        iconCssClass: 'fa fa-help',
        href: 'https://ils.test.rero.ch/help'
      }]
    }]
  };

  userMenu = {
    navCssClass: 'navbar-nav',
    dropdownMenuCssClass: 'dropdown-menu-right',
    iconCssClass: 'fa fa-user',
    entries: []
  };

  private _activeLanguagesMenuItem: any;

  constructor(
    private _appTranslateService: CoreTranslateService,
    private _translateService: TranslateService,
    private _configService: CoreConfigService,
    private _userService: UserService,
    private _recordService: RecordService,
    private _librarySwitchService: LibrarySwitchService,
    private _localeStorageService: LocalStorageService,
    private _menuService: MenuService,
    private _mainTitlePipe: MainTitlePipe
  ) { }

  ngOnInit() {
    this.initLinksMenu();
    const currentUser = this._userService.getCurrentUser();
    this.autocompleteQueryParams.organisation = currentUser.library.organisation.pid;
    this.languages = this._configService.languages;
    for (const lang of this.languages) {
      const data: any = { name: lang };
      if (lang === this.lang) {
        data.active = true;
        this._activeLanguagesMenuItem = data;
      }
      this.languagesMenu.entries[0].entries.splice(0, 0, data);
    }

    this.userMenu.entries.push({
      name: `${currentUser.first_name[0]}${currentUser.last_name[0]}`,
      entries: [
        {
          name: this._translateService.instant('Public interface'),
          href: '/',
          iconCssClass: 'fa fa-television'
        }, {
          name: this._translateService.instant('Logout'),
          href: `/logout`,
          iconCssClass: 'fa fa-sign-out'
        }
      ]
    });

    this.recordTypes = [{
      type: 'documents',
      field: 'autocomplete_title',
      maxNumberOfSuggestions: 5,
      preFilters: {organisation: currentUser.library.organisation.pid},
      getSuggestions: (query, documents) => this.getDocumentsSuggestions(query, documents)
    }, {
      type: 'persons',
      field: 'autocomplete_name',
      maxNumberOfSuggestions: 5,
      getSuggestions: (query, persons) => this.getPersonsSuggestions(query, persons)
    }];

    this._recordService.getRecord('organisations', currentUser.library.organisation.pid)
      .subscribe(organisation => {
        this.userMenu.entries[0].entries[0].href = `/${organisation.metadata.code}/`;
      });

    this._librarySwitchService.onVisibleMenu$.subscribe((visible) => {
      if (
        visible
        && this._userService.hasRole('system_librarian')
        && this._librarySwitchService.entries.length === 0) {
        this._librarySwitchService.generateMenu();
      }
    });

    this._librarySwitchService.onGenerate$.subscribe((entries: any) => {
      this.librariesSwitchMenu.entries[0].entries = entries;
    });

  }

  changeLibrary(item: { name: string, id: string }) {
    this._librarySwitchService.switch(item.id);
  }

  get isVisibleLibrarySwitchMenu() {
    if (this._librarySwitchService.length <= 1) {
      return false;
    }
    return this._librarySwitchService.visible;
  }

  get isVisible() {
    return this._librarySwitchService.visible;
  }

  initLinksMenu() {
    this.linksMenu = this._menuService.linksMenu;

    this._localeStorageService.onSet$.subscribe(() => {
      const link = this.linksMenu.entries[3].entries.find(
        (element: any) => element.routerLink.indexOf('/libraries/detail') > -1
      );
      link.routerLink = this.myLibraryRouterLink();
    });
  }

  changeLang(item) {
    this._appTranslateService.setLanguage(item.name);
    delete (this._activeLanguagesMenuItem.active);
    item.active = true;
    this._activeLanguagesMenuItem = item;
    this.initLinksMenu();
  }

  getPersonsSuggestions(query, persons) {
    const values = [];
    persons.hits.hits.map(hit => {
      let text = this.getPersonName(hit.metadata);
      text = text.replace(new RegExp(query, 'gi'), `<b>${query}</b>`);
      values.push({
        text,
        query: '',
        pid: hit.metadata.pid,
        index: 'persons',
        category: this._translateService.instant('direct links'),
        href: `/records/persons/detail/${hit.metadata.pid}`,
        iconCssClass: 'fa fa-user'
      });
    });
    return values;
  }

  getDocumentsSuggestions(query, documents) {
    const values = [];
    documents.hits.hits.map(hit => {
      let text = this._mainTitlePipe.transform(hit.metadata.title);
      let truncate = false;
      if (text.length > this.maxLengthSuggestion) {
        truncate = true;
        text = this._mainTitlePipe.transform(hit.metadata.title).substr(0, this.maxLengthSuggestion);
      }
      text = text.replace(new RegExp(query, 'gi'), `<b>${query}</b>`);
      if (truncate) {
        text = text + ' ...';
      }
      values.push({
        text,
        query: this._mainTitlePipe.transform(hit.metadata.title).replace(/[:\-\[\]()/"]/g, ' ').replace(/\s\s+/g, ' '),
        index: 'documents',
        pid: undefined,
        category: this._translateService.instant('documents')
        // href: `/records/documents/detail/${hit.metadata.pid}`
      });
    });
    return values;
  }

  private getPersonName(metadata) {
    for (const source of ['rero', 'idref', 'bnf', 'gnd']) {
      if (metadata[source] && metadata[source].preferred_name_for_person) {
        return metadata[source].preferred_name_for_person;
      }
    }
  }

  private myLibraryRouterLink() {
    return `/records/libraries/detail/${this._userService.getCurrentUser().currentLibrary}`;
  }
}
