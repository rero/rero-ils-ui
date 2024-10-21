/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { EventEmitter, Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigService, Record } from '@rero/ng-core';
import { PERMISSION_OPERATOR, PermissionsService, UserService } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { Observable, map, of } from 'rxjs';
import { LibraryApiService } from '../api/library-api.service';
import { MENU_IDS } from '../menu-definition/menu-ids';
import { LibrarySwitchStorageService } from './library-switch-storage.service';
import { ISwitchLibrary, LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private userService: UserService = inject(UserService);
  private libraryApiService: LibraryApiService = inject(LibraryApiService);
  private libraryService: LibraryService = inject(LibraryService);
  private librarySwitchDataStorage: LibrarySwitchStorageService = inject(LibrarySwitchStorageService);
  private translateService: TranslateService = inject(TranslateService);
  private configService: CoreConfigService = inject(CoreConfigService);
  private httpClient: HttpClient = inject(HttpClient);
  private permissionsService: PermissionsService = inject(PermissionsService);

  private logoutEvent = new EventEmitter<boolean>();

  private onChange = new EventEmitter<MenuItem[]>();

  private applicationMenuItems: MenuItem[] = [];

  get logout$(): Observable<boolean> {
    return this.logoutEvent.asObservable();
  }

  get onChange$(): Observable<MenuItem[]> {
    return this.onChange.asObservable();
  }

  set appMenuItems(menuItems: MenuItem[]) {
    this.applicationMenuItems = menuItems;
  }

  get appMenuItems(): MenuItem[] {
    return this.applicationMenuItems;
  }

  public generateMenuLanguages(): MenuItem[] {
    let languagesMenu = [];
    const currentLanguage = this.translateService.currentLang;
    this.configService.languages.map((language: string) => {
      languagesMenu.push({
        label: this.translateService.instant(`ui_language_${language}`),
        translateLabel: `ui_language_${language}`,
        id: `lang-${language}`,
        styleClass: currentLanguage === language ? 'font-bold' : '',
        command: () => this.httpClient
          .post(`/language`, {lang: language})
          .subscribe(() => this.translateService.use(language))
      });
    });
    languagesMenu = languagesMenu.sort((a: any, b: any) => a.label.localeCompare(b.label));

    return languagesMenu;
  }

  public generateMenuLibrary$(): Observable<object|undefined> {
    const { currentLibrary } = this.userService.user;
    const librariesPid = this.userService.user.patronLibrarian.libraries.map((library: { pid: string }) => library.pid);
    if (librariesPid.length === 0) {
      return of(undefined);
    }
    return this.libraryApiService.findByLibrariesPidAndOrderBy$(librariesPid).pipe(
      map((results: Record) => results.hits.total.value > 0 ? results.hits.hits : []),
      map((libraries: any) => {
        let libraryActive = undefined;
        if (!this.librarySwitchDataStorage.has()) {
          libraryActive = libraries.find((library: any) => library.metadata.pid === currentLibrary);
        } else {
          const data = this.librarySwitchDataStorage.get();
          libraryActive = libraries.find((library: any) => library.metadata.pid === data.currentLibrary);
          if (!libraryActive) {
            libraryActive = libraries.find((library: any) => library.metadata.pid === currentLibrary);
          }
        }
        const menu = {
          label: libraryActive.metadata.code,
          icon: 'fa fa-random',
          id: MENU_IDS.LIBRARY_MENU,
          items: []
        };
        libraries.sort((a: any, b:any) => a.metadata.code.localeCompare(b.metadata.code))
        .map((library: any) => menu.items.push({
          label: `[${library.metadata.code}] ${library.metadata.name}`,
          code: library.metadata.code,
          pid: library.metadata.pid,
          styleClass: library.metadata.pid === libraryActive.metadata.pid ? 'font-bold' : '',
          command: () => this.libraryService.switch({
            pid: library.metadata.pid,
            code: library.metadata.code,
            name: library.metadata.name
          })
        }));

        return { menu, libraryActive: {
          pid: libraryActive.metadata.pid,
          code: libraryActive.metadata.code,
          name: libraryActive.metadata.name
        } };
      }));
    ;
  }

  public generateAppMenu(menuItems: MenuItem[]): MenuItem[] {
    const items = this.processMenuApp(menuItems).filter((item: any) => item);
    this.appMenuItems = items;

    return items;
  }

  public updateLibraryLink(library: ISwitchLibrary): void {
    const item = this.appMenuItems
    .find((item: MenuItem) => item.id === MENU_IDS.APP.ADMIN.MENU).items
    .find((item: MenuItem) => item.id === MENU_IDS.APP.ADMIN.MY_LIBRARY);
    const routerLink = [...item.routerLink];
    routerLink[4] = library.pid;
    item.routerLink = routerLink;
  }

  public updateLibraryQueryParams(library: ISwitchLibrary): void {
    this.updateQueryParams(this.appMenuItems, library);
  }

  public logout(): void {
    this.logoutEvent.emit(true);
  }

  private processMenuApp(menuItems: MenuItem[]): MenuItem[] {
    return menuItems.map((item: MenuItem) => {
      let canAccess = true;
      if (item.access) {
        canAccess = this.permissionsService.canAccess(
          item.access.permissions,
          item.access.operator || PERMISSION_OPERATOR.OR
        );
      }
      if (!canAccess) {
        return;
      }

      delete item['access'];

      if (!item.url && !item.routerLink && item.items) {
        item.items = this.processMenuApp(item.items).filter((item: any) => item);
      }

      return item;
    });
  }

  private updateQueryParams(menuItems: MenuItem[], library: ISwitchLibrary): MenuItem[] {
    menuItems.map((item: MenuItem) => {
      if (item.queryParams) {
        item.queryParams = this.processQueryParams(item.queryParams, library);
      }
      if (item.items) {
        item.items = this.updateQueryParams(item.items, library);
      }
    });

    return menuItems;
  }

  private processQueryParams(queryParams: object, library: ISwitchLibrary): Object {
    if ('library' in queryParams) {
      return { ...queryParams, library: library.pid }
    }

    return queryParams;
  }
}
