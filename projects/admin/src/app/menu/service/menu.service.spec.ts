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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, MenuItem, MenuItemInterface } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService, SharedModule, testUserLibrarianWithSettings, User, UserService } from '@rero/shared';
import { LibrarySwitchService } from './library-switch.service';
import { MenuFactoryService } from './menu-factory.service';

import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let translateService: TranslateService;
  let configService: CoreConfigService;
  let permissionsService: PermissionsService;
  let librarySwitchService: LibrarySwitchService;
  let userService: UserService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  const user =  new User(testUserLibrarianWithSettings);
  user.currentLibrary = '2';
  user.currentOrganisation = '1';
  userServiceSpy.user =user;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        SharedModule
      ],
      providers: [
        MenuFactoryService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(MenuService);

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('fr', {
      'Logout': 'Se déconnecter',
      'My library': 'Ma bibliothèque',
      'Public interface': 'Interface publique',
      'ui_language_de': 'Allemand',
      'ui_language_en': 'Anglais',
      'ui_language_fr': 'Français'
    });
    translateService.setTranslation('en', {
      'Logout': 'Logout',
      'My library': 'My library',
      'Public interface': 'Public interface',
      'ui_language_de': 'German',
      'ui_language_en': 'English',
      'ui_language_fr': 'French'
    });
    translateService.use('fr');

    configService = TestBed.inject(CoreConfigService);
    configService.languages = ['fr', 'en', 'de'];

    permissionsService = TestBed.inject(PermissionsService);
    permissionsService.setPermissions(Object.values(PERMISSIONS));

    librarySwitchService = TestBed.inject(LibrarySwitchService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /** ----- Application menu ----- */
  it('should return the french application menu', () => {
    userService.user.currentLibrary = '2';
    service.appMenu$.subscribe((menu: MenuItemInterface) => {
      expect(menu).toBeInstanceOf(MenuItem);
      const appMenu = menu.getChildren();
      expect(appMenu[0].getAttribute('id')).toEqual('user-services-menu');
      expect(appMenu[1].getAttribute('id')).toEqual('catalog-menu');
      expect(appMenu[2].getAttribute('id')).toEqual('acquisitions-menu');
      expect(appMenu[3].getAttribute('id')).toEqual('report-monitoring-menu');
      expect(appMenu[4].getAttribute('id')).toEqual('admin-and-monitoring-menu');
      const adminMenu = appMenu[4].getChildren();
      const myLibraryMenu = adminMenu[4];
      expect(myLibraryMenu.getName()).toEqual('Ma bibliothèque');
      expect(myLibraryMenu.getRouterLink()).toEqual(['/', 'records', 'libraries', 'detail', '2']);
    });
    service.generateAppMenu();
  });

  it('should return the english application menu', () => {
    userService.user.currentLibrary = '2';
    service.appMenu$.subscribe((menu: MenuItemInterface) => {
      const appMenu = menu.getChildren();
      const adminMenu = appMenu[4].getChildren();
      const myLibraryMenu = adminMenu[4];
      expect(myLibraryMenu.getName()).toEqual('My library');
    });
    translateService.use('en');
  });

  it('should return the correct library code after the change', () => {
    userService.user.currentLibrary = '2';
    service.appMenu$.subscribe((menu: MenuItemInterface) => {
      const appMenu = menu.getChildren();
      const adminMenu = appMenu[4].getChildren();
      const myLibraryMenu = adminMenu[4];
      expect(myLibraryMenu.getRouterLink()).toEqual(['/', 'records', 'libraries', 'detail', '3']);
    });
    librarySwitchService.switch('3');
  });

  /** ----- User menu ----- */
  it('should return the french user menu', () => {
    service.userMenu$.subscribe((menu: MenuItemInterface) => {
      expect(menu).toBeInstanceOf(MenuItem);
      const userMenu = menu.getChildren()[0].getChildren();
      expect(userMenu[0].getName()).toEqual('Interface publique');
      expect(userMenu[1].getName()).toEqual('Se déconnecter');
    });
    service.generateUserMenu();
  });

  it('should return the english user menu', () => {
    service.userMenu$.subscribe((menu: MenuItemInterface) => {
      expect(menu).toBeInstanceOf(MenuItem);
      const userMenu = menu.getChildren()[0].getChildren();
      expect(userMenu[0].getName()).toEqual('Public interface');
      expect(userMenu[1].getName()).toEqual('Logout');
    });
    translateService.use('en');
  });

  /** ----- Language menu ----- */
  it('should return the french language menu', () => {
    service.languageMenu$.subscribe((menu: MenuItemInterface) => {
      expect(menu).toBeInstanceOf(MenuItem);
      const languageMenu = menu.getChildren()[0].getChildren();
      expect(languageMenu[0].getName()).toEqual('Allemand');
      expect(languageMenu[0].getAttribute('id')).toEqual('language-menu-de');
      expect(languageMenu[0].getExtra('language')).toEqual('de');
      expect(languageMenu[1].getName()).toEqual('Anglais');
      expect(languageMenu[2].getName()).toEqual('Français');
    });
    service.generateLanguageMenu();
  });

  it('should return the english language menu', () => {
    service.languageMenu$.subscribe((menu: MenuItemInterface) => {
      const languageMenu = menu.getChildren()[0].getChildren();
      expect(languageMenu[0].getName()).toEqual('German');
      expect(languageMenu[1].getName()).toEqual('English');
      expect(languageMenu[2].getName()).toEqual('French');
    });
    translateService.use('en');
  });

});
