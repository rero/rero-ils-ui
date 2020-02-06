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
import { RecordService, RecordEvent, LocalStorageService } from '@rero/ng-core';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../class/user';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchService {

  /**
   * On generate menu event
   */
  private onGenerateMenu: Subject<Array<any>> = new Subject();

  /**
   * On Visible Menu
   */
  private onVisibleMenu: Subject<boolean> = new Subject();

  /**
   * Entries for library switch menu
   */
  private menuEntries = [];

  /**
   * Current library record
   */
  private currentLibraryRecord: any;

  /**
   * Visibility of the menu
   */
  private menuVisible = false;

  /**
   * Return on generate menu observable
   */
  get onGenerate$() {
    return this.onGenerateMenu.asObservable();
  }

  /**
   * Return on visible menu observable
   */
  get onVisibleMenu$() {
    return this.onVisibleMenu.asObservable();
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
   * Return the visibility of menu
   */
  get visible() {
    if (!this.userService.hasRole('system_librarian')) {
      return false;
    }
    return this.menuVisible;
  }

  /**
   * Constructor
   * @param recordService - RecordService
   * @param userService - UserService
   * @param localStorageService - LocalStorageService
   */
  constructor(
    private recordService: RecordService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private libraryService: LibraryService
  ) {
    this.initObservables();
  }

  /**
   * Visibility of the menu
   * @return void
   */
  show(visible: boolean) {
    this.menuVisible = visible;
    this.onVisibleMenu.next(visible);
  }

  /**
   * Generate entries menu
   * @return void
   */
  generateMenu() {
    if (this.visible) {
      this.libraryService.allOrderBy$('name').pipe(
        map(results => results.hits.hits.filter((data: any) =>
          data.metadata.pid !== this.userService.getCurrentUser().getCurrentLibrary()
        ))
      ).subscribe(libraries => {
        this.menuEntries = [];
        libraries.map((library: any) => this.menuEntries.push({
          name: library.metadata.name,
          id: library.metadata.pid
        }));
        this.onGenerateMenu.next(this.menuEntries);
      });
    }
  }

  /**
   * Load current library record
   * @param libraryPid - string
   */
  loadCurrentLibrary(libraryPid: string) {
    this.libraryService.get$(libraryPid).subscribe((library: any) => {
      this.currentLibraryRecord = library.metadata;
    });
  }

  /**
   * Switch library
   * @param libraryPid - string
   */
  switch(libraryPid: string) {
    const key = User.STORAGE_KEY;
    const data = this.localStorageService.get(key);
    data.currentLibrary = libraryPid;
    this.localStorageService.set(key, data);
    this.loadCurrentLibrary(libraryPid);
    this.generateMenu();
  }

  /**
   * Initialize Observables
   * @return void
   */
  private initObservables() {
    this.recordService.onCreate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        this.generateMenu();
      }
    });
    this.recordService.onUpdate$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        const libraryPid = event.data.record.pid;
        if (this.userService.getCurrentUser().getCurrentLibrary() === libraryPid) {
          this.loadCurrentLibrary(libraryPid);
        }
        this.generateMenu();
      }
    });
    this.recordService.onDelete$.subscribe((event: RecordEvent) => {
      if (event.resource === 'libraries') {
        const libraryPid = event.data.pid;
        if (this.userService.getCurrentUser().getCurrentLibrary() === libraryPid) {
          const userLibrary = this.userService.getCurrentUser().library;
          this.switch(userLibrary.pid);
        }
        this.generateMenu();
      }
    });
    this.localStorageService.onSet$.subscribe((event: any) => {
      if (event.key === User.STORAGE_KEY) {
        const local = event.data.data;
        const user = this.userService.getCurrentUser();
        if (user.getCurrentLibrary() !== local.currentLibrary) {
          user.setCurrentLibrary(local.currentLibrary);
          this.loadCurrentLibrary(local.currentLibrary);
          this.generateMenu();
        }
      }
    });
  }
}
