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
import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';
import { of } from 'rxjs';
import { PERMISSION_OPERATOR, PermissionsService, UserService } from '@rero/shared';
import { LibraryApiService } from '../api/library-api.service';
import { LibraryService } from './library.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LibrarySwitchStorageService } from './library-switch-storage.service';
import { CoreConfigService, LocalStorageService } from '@rero/ng-core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
class PermissionServiceSpy extends PermissionsService {
  canAccess(permission: string | string[], operator: string = PERMISSION_OPERATOR.OR): boolean {
    return permission === 'enabled';
  }
}

describe('MenuService', () => {
  let service: MenuService;
  let translate: TranslateService;

  const librariesResponse = {
    aggregations: {},
    hits: {
      hits: [
        {
          metadata: {
            pid: '1',
            name: 'Library 1',
            code: 'lib-1'
          }
        },
        {
          metadata: {
            pid: '2',
            name: 'Library 2',
            code: 'lib-2'
          }
        }
      ],
      total: {
        value: 2
      }
    },
    links: []
  };

  const appMenu = [
    {
      label: 'Menu 1',
      items: [
        {
          label: 'Menu 1 - line 1',
          access: {
            permissions: 'enabled'
          }
        },
        {
          label: 'Menu 1 - line 2',
          access: {
            permissions: 'disabled'
          }
        },
        ,
        {
          label: 'Menu 1 - line 3',
          access: {
            permissions: 'enabled'
          }
        }
      ]
    },
    {
      label: 'Menu 2',
      items: [
        {
          label: 'Menu 2 - line 1'
        }
      ]
    }
  ];

  const translations = {
    'ui_language_de': 'Deutsch',
    'ui_language_en': 'English',
    'ui_language_fr': 'Français'
  };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    id: 1,
    currentLibrary: '1',
    patronLibrarian: {
      libraries: [{ pid: '1' }, { pid: '2' }]
    }
  }

  const libraryApiServiceSpy = jasmine.createSpyObj('libraryApiService', ['findByLibrariesPidAndOrderBy$']);
  libraryApiServiceSpy.findByLibrariesPidAndOrderBy$.and.returnValue(of(librariesResponse));

  const libraryServiceSpy = jasmine.createSpyObj('LibraryService', ['']);

  const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['has', 'set']);
  localStorageServiceSpy.has.and.returnValue(false);

  const librarySwitchDataStorageSpy = jasmine.createSpyObj('LibrarySwitchStorageService', ['has']);
  librarySwitchDataStorageSpy.has.and.returnValue(false);

  const configServiceSpy = jasmine.createSpyObj('configService', ['']);
  configServiceSpy.languages = ['fr','en', 'de'];

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
  httpClientSpy.post.and.returnValue(of({}));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LibraryApiService, useValue: libraryApiServiceSpy },
        { provide: LibraryService, useValue: libraryServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: LibrarySwitchStorageService, use: librarySwitchDataStorageSpy },
        { provide: CoreConfigService, useValue: configServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: PermissionsService, useClass: PermissionServiceSpy },
        TranslateService
      ]
    });
    service = TestBed.inject(MenuService);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('fr', translations);
    translate.use('fr');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the language menu lines', () => {
    const languages = service.generateMenuLanguages();
    expect(languages[0].label).toEqual(translations.ui_language_de);
    expect(languages[0].translateLabel).toEqual('ui_language_de');
    expect(languages[0].id).toEqual('lang-de');
    expect(typeof languages[0].command === 'function').toBeTrue();

    expect(languages[1].label).toEqual(translations.ui_language_en);
    expect(languages[2].label).toEqual(translations.ui_language_fr);
    expect(languages[2].styleClass).toEqual('font-bold');
  });

  it('should return library menu lines', () => {
    service.generateMenuLibrary$().subscribe((menu: MenuItem) => {
      expect(menu.label).toEqual('lib-1');
      expect(menu.id).toEqual('menu-library');
      expect(menu.icon).not.toBeNull();
      expect(menu.items.length).toEqual(2);
      expect(menu.items[0].code).toEqual('lib-1');
      expect(menu.items[0].label).toEqual('[lib-1] Library 1');
      expect(menu.items[0].pid).toEqual('1');
      expect(typeof menu.items[0].command === 'function').toBeTrue()
    });
  });

  it('should return the application\'s menu lines', () => {
    const menu = service.generateAppMenu(appMenu);
    expect(menu[0].label).toEqual('Menu 1');
    expect(menu[0].items.length).toEqual(2);
    expect(menu[0].items[0].label).toEqual('Menu 1 - line 1');
    expect(menu[0].items[1].label).toEqual('Menu 1 - line 3');
    expect(menu[1].label).toEqual('Menu 2');
    expect(menu[1].items.length).toEqual(1);
  });

  it('should return true on the logout event', () => {
    service.logout$.subscribe((event: boolean) => expect(event).toBeTrue());
    service.logout();
  });
});
