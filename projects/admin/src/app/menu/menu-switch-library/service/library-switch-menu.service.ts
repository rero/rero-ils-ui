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
import { MenuFactory, MenuItem, Record, RecordEvent, RecordService } from '@rero/ng-core';
import { User } from '@rero/shared';
import { map } from 'rxjs/operators';
import { LibraryService } from '../../../service/library.service';
import { LibrarySwitchService } from './library-switch.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchMenuService {

  /** User */
  private _user: User;

  /** Menu */
  private _menu: any;

  /** Current Library */
  private _currentLibrary: MenuItem;

  /** Available libraries */
  private _librariesMenu = {};

  /** menu is visible */
  get visible() {
    return this._user.hasRole('system_librarian')
      ? true
      : this._user.libraries.length > 1;
  }

  /** Get menu */
  get menu() {
    return this._menu;
  }

  /**
   * Constructor
   * @param _librarySwitchService - LibrarySwitchService
   * @param _libraryService - LibraryService
   * @param _recordService - RecordService
   * @param _translateService - TranslateService
   */
  constructor(
    private _librarySwitchService: LibrarySwitchService,
    private _libraryService: LibraryService,
    private _recordService: RecordService,
    private _translateService: TranslateService
  ) { }

  /** Init */
  init() {
    this._initObservable();
  }

  /** Generate */
  private _generate() {
    if (this._user.hasRole('system_librarian')) {
      this._systemLibrarianLibraries();
    } else if (this._user.libraries.length > 1) {
      this._librarianLibraries();
    }
  }

  /** System librarian libraries */
  private _systemLibrarianLibraries() {
    this._executeLibrariesQuery(
      this._libraryService.findAllOrderBy$('name')
    ).subscribe((libraries: any) =>  this._generateMenu(libraries));
  }

  /** Librarian libraries */
  private _librarianLibraries() {
    const librariesPid = this._user.libraries.map(library =>  library.pid);
    this._executeLibrariesQuery(
      this._libraryService.findByLibrariesPidAndOrderBy$(librariesPid, 'name')
    ).subscribe((libraries: any) => this._generateMenu(libraries));
  }

  /**
   * Execute query with an Observable
   * @param query - Observable
   * @return Observable
   */
  private _executeLibrariesQuery(query: any) {
    return query.pipe(
      map((results: Record) => this._recordService
        .totalHits(results.hits.total) > 0 ? results.hits.hits : []
      ),
      map((result: any) => {
        const libraries = {};
        result.map((library: any) => {
          libraries[library.metadata.pid] = library.metadata;
        });
        return libraries;
      })
    );
  }

  /**
   * Generate Menu
   * @param libraries - array of library record
   */
  private _generateMenu(libraries: any) {
    this._librariesMenu = {};
    const factory = new MenuFactory();
    this._menu = factory.createItem('Switch Libraries');
    const currentLibrary = libraries[this._user.currentLibrary];
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
      if (key === this._user.currentLibrary) {
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
    // library swith observable
    this._librarySwitchService.librarySwitch$.subscribe((user: User) => {
      this._user = user;
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
      if (event.resource === 'libraries') {
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
      if (event.resource === 'libraries') {
        const library = event.data;
        if (this._user.currentLibrary === library.pid) {
          this._librarySwitchService.switch(this._user.libraries[0].pid);
        }
        this._generate();
      }
    });
  }
}
