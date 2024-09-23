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
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUserComponent } from './menu-user.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '../service/menu.service';
import { MenuTranslateService } from '../service/menu-translate.service';
import { UserService } from '@rero/shared';
import { LibrarySwitchStorageService } from '../service/library-switch-storage.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ISwitchLibrary, LibraryService } from '../service/library.service';
import { MENU_IDS } from '../menu-definition/menu-ids';

describe('AppMenuUserComponent', () => {
  let component: MenuUserComponent;
  let fixture: ComponentFixture<MenuUserComponent>;
  let libraryService: LibraryService;
  let translateService: TranslateService;

  const menuItems: MenuItem[] = [
    {
      label: 'library',
      id: MENU_IDS.LIBRARY_MENU,
      items: [
        {
          label: 'library name',
          code: 'library-code',
          pid: '1',
          styleClass: null,
        }
      ]
    },
    {
      label: 'menu',
      id: MENU_IDS.USER.MENU,
      items: [
        {
          label: 'language',
          id: MENU_IDS.USER.LANGUAGE,
          items: [
            {
              label: 'french',
              code: 'fr',
              id: 'lang-fr',
              styleClass: null,
            },
            {
              label: 'English',
              code: 'en',
              id: 'lang-en',
              styleClass: null,
            },
          ],
        },
        {
          label: 'logout',
          id: MENU_IDS.USER.LOGOUT,
          command: () => {},
        },
      ],
    },
  ];

  const librarySwitch: ISwitchLibrary = {
    pid: '1',
    code: 'library-code',
    name: 'library name'
  };

  const menuServiceSpy = jasmine.createSpyObj('MenuService', ['generateMenuLibrary$', 'generateMenuLanguages', 'logout']);
  menuServiceSpy.generateMenuLibrary$.and.returnValue(of([]));

  const menuTranslateServiceSpy = jasmine.createSpyObj('MenuTranslateService', ['process']);
  menuTranslateServiceSpy.process.and.returnValue(menuItems);

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    id: 1,
    currentLibrary: 'foo'
  };

  const librarySwitchStorageServiceSpy = jasmine.createSpyObj('LibrarySwitchStorageService', ['save']);

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MenuUserComponent
      ],
      providers: [
        { provide: MenuService, useValue: menuServiceSpy },
        { provide: MenuTranslateService, useValue: menuTranslateServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: LibrarySwitchStorageService, useValue: librarySwitchStorageServiceSpy },
        { provide: Router, useValue: routerSpy },
        LibraryService,
        TranslateService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuUserComponent);
    component = fixture.componentInstance;

    libraryService = TestBed.inject(LibraryService);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
    translateService.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the menu', () => {
    expect(fixture.debugElement.query(By.css('p-menubar'))).not.toBeNull();
  });

  it('should change the library menu', () => {
    expect(component.items.find((item: MenuItem) => item.id === MENU_IDS.LIBRARY_MENU).items[0].styleClass).toBeNull();
    libraryService.switch(librarySwitch);
    fixture.detectChanges();
    expect(component.items.find((item: MenuItem) => item.id === MENU_IDS.LIBRARY_MENU).items[0].styleClass).toEqual('font-bold');
  });

  it('should change the language menu', () => {
    expect(component.items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items
      .find((item: MenuItem) => item.id === 'lang-en')
      .styleClass).toEqual('font-bold');

    translateService.use('fr');
    expect(component.items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items
      .find((item: MenuItem) => item.id === 'lang-fr')
      .styleClass).toEqual('font-bold');
  });
});
