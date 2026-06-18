// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { MenuUserComponent } from './menu-user.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuTranslateService } from '../service/menu-translate.service';
import { AppStore } from '@rero/shared';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { ISwitchLibrary, MenuStore } from '../store/menu.store';
import { MENU_IDS } from '../menu-definition/menu-ids';
import { MenubarModule } from 'primeng/menubar';

describe('AppMenuUserComponent', () => {
  let component: MenuUserComponent;
  let fixture: ComponentFixture<MenuUserComponent>;
  let translateService: TranslateService;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const menuItems: MenuItem[] = [
    {
      name: 'library',
      translateLabel: 'library',
      id: MENU_IDS.LIBRARY_MENU,
      items: [
        {
          name: 'library name',
          code: 'library-code',
          pid: '1' }
      ]
    },
    {
      name: 'menu',
      translateLabel: 'menu',
      id: MENU_IDS.USER.MENU,
      items: [
        {
          name: 'language',
          id: MENU_IDS.USER.LANGUAGE,
          items: [
            {
              label: 'french',
              code: 'fr',
              id: 'lang-fr'
            },
            {
              label: 'English',
              code: 'en',
              id: 'lang-en'
            },
          ] },
        {
          label: 'logout',
          id: MENU_IDS.USER.LOGOUT,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          command: () => {} },
      ] },
  ];

  const librarySwitch: ISwitchLibrary = {
    pid: '1',
    code: 'library-code',
    name: 'library name'
  };

  const libraryMenuSignal = signal({ menu: menuItems[0], libraryActive: librarySwitch });
  const selectedLibrarySignal = signal<ISwitchLibrary | null>(null);

  const menuStoreSpy = {
    libraryMenu: libraryMenuSignal,
    selectedLibrary: selectedLibrarySignal,
    generateMenuLanguages: vi.fn(),
    updateLibraryQueryParams: vi.fn(),
    clearSelectedLibrary: vi.fn(),
    logout: vi.fn(),
  } as any;

  menuStoreSpy.generateMenuLanguages.mockImplementation(() => [
    {
      label: 'french',
      code: 'fr',
      id: 'lang-fr',
      styleClass: translateService?.getCurrentLang() === 'fr' ? 'ui:font-bold' : ''
    },
    {
      label: 'English',
      code: 'en',
      id: 'lang-en',
      styleClass: translateService?.getCurrentLang() === 'en' ? 'ui:font-bold' : ''
    },
  ]);

  const menuTranslateServiceSpy = { process: vi.fn() };
  menuTranslateServiceSpy.process.mockImplementation((items: MenuItem[]) => items);

  const appStoreSpy = { } as any;
  appStoreSpy.user = signal({ id: 1 });

  const routerSpy = { navigate: vi.fn() };

  beforeEach(async () => {
    menuStoreSpy.updateLibraryQueryParams.mockReset();
    routerSpy.navigate.mockReset();
    selectedLibrarySignal.set(null);

    await TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot(),
        MenubarModule,
        MenuUserComponent,
    ],
    providers: [
        { provide: MenuStore, useValue: menuStoreSpy },
        { provide: MenuTranslateService, useValue: menuTranslateServiceSpy },
        { provide: AppStore, useValue: appStoreSpy },
        { provide: Router, useValue: routerSpy },
        TranslateService
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(MenuUserComponent);
    component = fixture.componentInstance;

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
    expect(component.items().find((item: MenuItem) => item.id === MENU_IDS.LIBRARY_MENU)?.items?.[0].styleClass).toBeUndefined();
    selectedLibrarySignal.set(librarySwitch);
    libraryMenuSignal.set({
      menu: {
        ...menuItems[0],
        label: librarySwitch.code,
        items: [{ ...menuItems[0].items[0], styleClass: 'ui:font-bold' }]
      },
      libraryActive: librarySwitch
    });
    fixture.detectChanges();
    expect(menuStoreSpy.updateLibraryQueryParams).toHaveBeenCalledWith(librarySwitch);
    expect(component.items().find((item: MenuItem) => item.id === MENU_IDS.LIBRARY_MENU)?.items?.[0].styleClass).toEqual('ui:font-bold');
  });

  it('should change the language menu', () => {
    expect(component.items()
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items
      .find((item: MenuItem) => item.id === 'lang-en').styleClass)
      .toEqual('ui:font-bold');

    translateService.use('fr');
    fixture.detectChanges();
    expect(component.items()
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items
      .find((item: MenuItem) => item.id === 'lang-fr').styleClass)
      .toEqual('ui:font-bold');
  });
});
