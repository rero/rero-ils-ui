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

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuFactory, MenuItemInterface, Record, RecordEvent, RecordService } from '@rero/ng-core';
import { User, UserService } from '@rero/shared';
import { map } from 'rxjs/operators';
import { LibraryService } from '../../service/library.service';
import { LibrarySwitchService } from './library-switch.service';


@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchMenuService {

  /** Menu */
  private _menu: MenuItemInterface;

  /** Current Library */
  private _currentLibrary: MenuItemInterface;

  /** Available libraries */
  private _librariesMenu = {};

  /** menu is visible */
  get visible(): boolean {
    return this._userService.user.patronLibrarian.libraries.length > 1;
  }

  /** Get menu */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _librarySwitchService - LibrarySwitchService
   * @param _libraryService - LibraryService
   * @param _recordService - RecordService
   * @param _translateService - TranslateService
   * @param _userService - UserService
   */
  constructor(
    private _librarySwitchService: LibrarySwitchService,
    private _libraryService: LibraryService,
    private _recordService: RecordService,
    private _translateService: TranslateService,
    private _userService: UserService
  ) { }

  /** Init */
  init() {
    this._initObservable();
  }

  /** Generate */
  private _generate() {
    const librariesPid = this._userService.user.patronLibrarian.libraries.map(library =>  library.pid);
    this._libraryService.findByLibrariesPidAndOrderBy$(librariesPid, 'name').pipe(
      map((results: Record) => this._recordService
        .totalHits(results.hits.total) > 0 ? results.hits.hits : []
      ),
      map((result: any) => {
        const libraries = {};
        result.map((library: any) => {
          libraries[library.metadata.pid] = library.metadata;
        });
        return libraries;
      })).subscribe((libraries: any) => this._generateMenu(libraries));
  }

  /**
   * Generate Menu
   * @param libraries - array of library record
   */
  private _generateMenu(libraries: any) {
    this._librariesMenu = {};
    const factory = new MenuFactory();
    this._menu = factory.createItem('Switch Libraries');
    const currentLibrary = libraries[this._userService.user.currentLibrary];
    const libMenu = this._menu.addChild(currentLibrary.code)
      .setAttribute('class', 'dropdown-menu dropdown-menu-right')
      .setExtra('iconClass', 'fa fa-random');
    this._currentLibrary = libMenu;
    Object.keys(libraries).map((key: string) => {
      const library = libraries[key];
      const libraryLine = libMenu.addChild(library.name)
        .setAttribute('id', `library-${library.pid}`)
        .setPrefix(`[${library.code}]`, 'pr-2 text-dark small font-weight-bold')
        .setExtra('id', library.pid)
        .setExtra('code', library.code);
      if (key === this._userService.user.currentLibrary) {
        this._setActive(libraryLine);
      }
      // Proxy library menu item
      this._librariesMenu[key] = libraryLine;
    });
  }

  /**
   * Set library active
   * @param line - Menu Item
   */
  private _setActive(line: any) {
    line.setSuffix(
      `(${this._translateService.instant('active')})`,
      'pl-2 text-info small font-weight-bold'
    ).setActive(false);
  }

  /** Init observable */
  private _initObservable() {
    // library switch observable
    this._librarySwitchService.librarySwitch$.subscribe((user: User) => {
      // If the proxy is empty
      const librariesKeys = Object.keys(this._librariesMenu);
      if (librariesKeys.length === 0) {
        // Generate menu
        this._generate();
      } else {
        // Use proxy to update menu
        this._currentLibrary.setName(
          this._librariesMenu[user.currentLibrary].getExtra('code')
        );
        librariesKeys.map((key: any) => this._librariesMenu[key].removeSuffix());
        this._setActive(this._librariesMenu[user.currentLibrary]);
      }
    });

    // when a library resource is created
    // --> if a new library is created, then regenerate the menu
    this._recordService.onCreate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        this._generate();
      }
    });

    // when a library resource is updated
    // --> if the library updated, update library proxy
    this._recordService.onUpdate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries' && event.data.record !== undefined) {
        const library = event.data.record;
        this._librariesMenu[library.pid]
          .setName(library.name)
          .setExtra('code', library.code);
      }
    });

    // when a library resource is deleted
    // --> if a new library is deleted, then regenerate the menu
    // --> If the user is connected to the library that is deleted, switch to the first library.
    this._recordService.onDelete$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries' && event.data.record !== undefined) {
        const library = event.data.record;
        if (this._userService.user.currentLibrary === library.pid) {
          this._librarySwitchService.switch(this._userService.user.patronLibrarian.libraries[0].pid);
      }
        this._generate();
      }
    });
  }
}
