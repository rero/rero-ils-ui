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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService, RecordEvent, RecordService } from '@rero/ng-core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../class/user';
import { LibraryService } from './library.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchService {

  /**
   * On generate menu event
   */
  private onGenerateMenu: Subject<Array<any>> = new Subject();

  /**
   * On current library changed event
   */
  private currentLibrarySubject: Subject<any> = new Subject<any>();

  /**
   * Entries for library switch menu
   */
  private menuEntries = [];

  /**
   * Current library record
   */
  private currentLibraryRecord: any;

  /**
   * Return current library observable
   */
  get currentLibraryRecord$() {
    return this.currentLibrarySubject.asObservable();
  }

  /**
   * Return on generate menu observable
   */
  get onGenerate$() {
    return this.onGenerateMenu.asObservable();
  }

  /**
   * Return library entries menu
   */
  get entries() {
    return this.menuEntries;
  }

  /**
   * Return the number of entry of menu
   */
  get length() {
    return this.menuEntries.length;
  }

  /**
   * Return current library select by user
   */
  get currentLibrary() {
    return this.currentLibraryRecord;
  }

  /**
   * Return the visibility of menu.
   *   The "switch library" menu should only be visible for system_librarian
   *   and if the organisation of the current logged user has, at least, two
   *   related libraries.
   * @return True if menu could be visible, false otherwise
   */
  get visible(): boolean {
    return this._userService.hasRole('system_librarian');
  }

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _userService - UserService
   * @param _localStorageService - LocalStorageService
   * @param _libraryService - LibraryService
   * @param _translateService: TranslateService
   * @param _router: Router
   */
  constructor(
    private _recordService: RecordService,
    private _userService: UserService,
    private _localStorageService: LocalStorageService,
    private _libraryService: LibraryService,
    private _translateService: TranslateService,
    private _router: Router
  ) {
    this.initObservables();
  }

  /**
   * Generate entries menu
   *   Get all libraries of the current logged user. Each library will be
   *   an entry of the switch library menu. The current used library should
   *   be disabled in this menu.
   *   Finally, When the menu is generated emit the 'generateMenu' event
   */
  generateMenu(): void {
    this._libraryService.allOrderBy$('name').pipe(
      map(results => (results.hits.total > 0) ? results.hits.hits : [])
    ).subscribe(libraries => {
      this.menuEntries = [];
      libraries.forEach((library: any) => {
        const data: any = {
          name: library.metadata.name,
          id: library.metadata.pid,
          prefix: `[${library.metadata.code}]`
        };
        if (this.currentLibraryRecord.pid === library.metadata.pid) {
          data.suffix = '(' + this._translateService.instant('active') + ')';
        }
        this.menuEntries.push(data);
      });
      this.onGenerateMenu.next(this.menuEntries);
    });
  }

  /**
   * Load current library record
   * @param libraryPid - string
   */
  private _loadCurrentLibrary(libraryPid: string) {
    this._libraryService.get$(libraryPid).subscribe((library: any) => {
      this.currentLibraryRecord = library.metadata;
      this.currentLibrarySubject.next(this.currentLibraryRecord);
    });
  }

  /**
   * Switch library
   * @param libraryPid: the library pid that user would used
   */
  switch(libraryPid: string): void {
    const key = User.STORAGE_KEY;
    const data = this._localStorageService.get(key);
    data.currentLibrary = libraryPid;
    this._localStorageService.set(key, data);
    // NOTE : As we are listening changed on localStorage, we don't need to modify
    //        menu to set the newly choose library as active, it will be done by
    //        the `generateMenu` called by this event handler.
    this._loadCurrentLibrary(libraryPid);
    // After the current library changed, then reload the current page to force component to update
    // NOTE : just navigate on the current URL doesn't easily work because, with basic configuration, Angular
    //        doesn't reload component data if url doesn't change. Using the below trick, we are sure to update
    //        all components.
    const currentFullURL = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => this._router.navigateByUrl(currentFullURL));
  }

  /**
   * Initialize Observables
   *   When any CRUD event is detected on a library the library switch menu should be refreshed
   *   When local storage 'user' changed, maybe we need to switch to an other current library
   */
  private initObservables(): void {
    // when a library resource is created
    //   --> if a new library is created, then regenerate the menuEntries
    this._recordService.onCreate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        this.generateMenu();
      }
    });
    // when a library resource is updated
    //   --> if the library updated is the library currently used, reload the currentLibrary to have refreshed data
    //   --> regenerate the menuEntries
    this._recordService.onUpdate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        const libraryPid = event.data.record.pid;
        if (this._userService.getCurrentUser().getCurrentLibrary() === libraryPid) {
          this._loadCurrentLibrary(libraryPid);
        }
        this.generateMenu();
      }
    });
    // when a library resource is delete
    //   --> if the deleted library is the same than current library, then switch to the library defined into user account
    //   --> regenerate the menuEntries
    this._recordService.onDelete$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        const libraryPid = event.data.pid;
        if (this._userService.getCurrentUser().getCurrentLibrary() === libraryPid) {
          const userLibrary = this._userService.getCurrentUser().library;
          this.switch(userLibrary.pid);
        }
        this.generateMenu();
      }
    });
    // when the local storage USER changed
    //   --> if local stored 'currentLibrary' <> current library then switch the library and regenerate the menuEntries
    this._localStorageService.onSet$.subscribe((event: any) => {
      if (event.key === User.STORAGE_KEY) {
        const local = event.data.data;
        const user = this._userService.getCurrentUser();
        if (user.getCurrentLibrary() !== local.currentLibrary) {
          user.setCurrentLibrary(local.currentLibrary);
          this._loadCurrentLibrary(local.currentLibrary);
          this.generateMenu();
        }
      }
    });
  }
}
