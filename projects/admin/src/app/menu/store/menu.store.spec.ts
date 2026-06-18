// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { AppStore, testPermissions, testUserLibrarianWithSettings, User } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { of } from 'rxjs';
import { LibraryApiService } from '../api/library-api.service';
import { LibrarySwitchStorageService } from '../service/library-switch-storage.service';
import { ISwitchLibrary, MenuStore } from './menu.store';

const libraryRecords = [
  { metadata: { pid: '1', code: 'LIB1', name: 'Library One' } },
  { metadata: { pid: '2', code: 'LIB2', name: 'Library Two' } },
];

const esResult = {
  hits: {
    total: { value: 2 },
    hits: libraryRecords
  }
};

const libUser = new User(testUserLibrarianWithSettings);

describe('MenuStore', () => {
  let store: InstanceType<typeof MenuStore>;

  const appStoreSpy = {
    user: vi.fn(),
    currentLibraryPid: vi.fn(),
    canAccess: vi.fn(),
    setCurrentLibrary: vi.fn(),
    permissions: vi.fn(),
  };

  const libraryApiSpy = {
    findByLibrariesPidAndOrderBy$: vi.fn()
  };

  const librarySwitchStorageSpy = {
    has: vi.fn(),
    get: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const translateServiceSpy = {
    getCurrentLang: vi.fn(),
    instant: vi.fn((key: string) => key),
    use: vi.fn().mockReturnValue(of({})),
  };

  const coreConfigServiceSpy = {
    languages: ['fr', 'de', 'en', 'it']
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset all mock implementations before each test
    appStoreSpy.user.mockReturnValue(libUser);
    appStoreSpy.currentLibraryPid.mockReturnValue('1');
    appStoreSpy.canAccess.mockReturnValue(true);
    appStoreSpy.setCurrentLibrary.mockReset();
    appStoreSpy.permissions.mockReturnValue(testPermissions);
    libraryApiSpy.findByLibrariesPidAndOrderBy$.mockReturnValue(of(esResult));
    librarySwitchStorageSpy.has.mockReturnValue(false);
    librarySwitchStorageSpy.save.mockReset();
    translateServiceSpy.getCurrentLang.mockReturnValue('fr');

    store = TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        MenuStore,
        { provide: AppStore, useValue: appStoreSpy },
        { provide: LibraryApiService, useValue: libraryApiSpy },
        { provide: LibrarySwitchStorageService, useValue: librarySwitchStorageSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: CoreConfigService, useValue: coreConfigServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).inject(MenuStore);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('applicationMenuItems should be empty', () => {
      expect(store.applicationMenuItems()).toEqual([]);
    });

    it('selectedLibrary should be null', () => {
      expect(store.selectedLibrary()).toBeNull();
    });

    it('logoutCounter should be 0', () => {
      expect(store.logoutCounter()).toBe(0);
    });

    it('libraries should be empty before async load', () => {
      expect(store.libraries()).toEqual([]);
    });

    it('libraryMenu should be undefined when no libraries loaded', () => {
      expect(store.libraryMenu()).toBeUndefined();
    });
  });

  describe('loadLibraries()', () => {
    it('should load libraries from API', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.libraries()).toHaveLength(2);
      expect(store.libraries()[0].metadata.pid).toBe('1');
    });

    it('should clear libraries when called with empty pid list', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.libraries()).toHaveLength(2);
      store.loadLibraries([]);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.libraries()).toEqual([]);
    });

    it('should build libraryMenu after loading libraries', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.libraryMenu()).toBeDefined();
      expect(store.libraryMenu()?.libraryActive.pid).toBe('1');
    });
  });

  describe('logout()', () => {
    it('should increment logoutCounter', () => {
      store.logout();
      expect(store.logoutCounter()).toBe(1);
    });

    it('should increment counter on each call', () => {
      store.logout();
      store.logout();
      expect(store.logoutCounter()).toBe(2);
    });
  });

  describe('switchLibrary()', () => {
    const lib: ISwitchLibrary = { pid: '2', code: 'LIB2', name: 'Library Two' };

    it('should update selectedLibrary', () => {
      store.switchLibrary(lib);
      expect(store.selectedLibrary()).toEqual(lib);
    });

    it('should call setCurrentLibrary on AppStore', () => {
      store.switchLibrary(lib);
      expect(appStoreSpy.setCurrentLibrary).toHaveBeenCalledWith('2');
    });

    it('should persist to LibrarySwitchStorageService', () => {
      store.switchLibrary(lib);
      expect(librarySwitchStorageSpy.save).toHaveBeenCalled();
    });
  });

  describe('generateAppMenu()', () => {
    it('should keep items without access restriction', () => {
      const menuItems: MenuItem[] = [
        { label: 'Allowed', id: 'allowed' },
        { label: 'Restricted', id: 'restricted', access: { permissions: ['some-perm'] } } as any,
      ];
      store.generateAppMenu(menuItems);
      expect(store.applicationMenuItems()).toHaveLength(2);
    });

    it('should remove items the user cannot access', () => {
      appStoreSpy.canAccess.mockReturnValue(false);
      const menuItems: MenuItem[] = [
        { label: 'Allowed', id: 'allowed' },
        { label: 'Restricted', id: 'restricted', access: { permissions: ['some-perm'] } } as any,
      ];
      store.generateAppMenu(menuItems);
      expect(store.applicationMenuItems()).toHaveLength(1);
      expect(store.applicationMenuItems()[0].id).toBe('allowed');
    });

    it('should strip the access property from kept items', () => {
      appStoreSpy.canAccess.mockReturnValue(true);
      const menuItems: MenuItem[] = [
        { label: 'Item', id: 'item', access: { permissions: ['some-perm'] } } as any,
      ];
      store.generateAppMenu(menuItems);
      expect((store.applicationMenuItems()[0] as any).access).toBeUndefined();
    });
  });

  describe('generateMenuLanguages()', () => {
    it('should return a menu item per language', () => {
      const items = store.generateMenuLanguages();
      expect(items).toHaveLength(coreConfigServiceSpy.languages.length);
    });

    it('should set bold style on current language', () => {
      const items = store.generateMenuLanguages();
      const current = items.find((i) => i.id === 'lang-fr');
      expect(current?.styleClass).toContain('font-bold');
    });

    it('should be sorted alphabetically by label', () => {
      const items = store.generateMenuLanguages();
      const labels = items.map((i) => String(i.label));
      expect(labels).toEqual([...labels].sort());
    });
  });

  describe('updateLibraryQueryParams()', () => {
    it('should update queryParams with library pid', () => {
      const lib: ISwitchLibrary = { pid: '2', code: 'LIB2', name: 'Library Two' };
      store.generateAppMenu([
        { label: 'Catalog', queryParams: { library: '1', other: 'keep' } }
      ]);
      store.updateLibraryQueryParams(lib);
      const item = store.applicationMenuItems()[0];
      expect(item.queryParams?.['library']).toBe('2');
      expect(item.queryParams?.['other']).toBe('keep');
    });
  });

  describe('libraryMenu computed', () => {
    it('should resolve selectedLibrary when set', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      store.switchLibrary({ pid: '2', code: 'LIB2', name: 'Library Two' });
      expect(store.libraryMenu()?.libraryActive.pid).toBe('2');
    });

    it('should fall back to currentLibraryPid when no selectedLibrary', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.libraryMenu()?.libraryActive.pid).toBe('1');
    });

    it('should sort library items by code', async () => {
      store.loadLibraries(['1', '2']);
      await vi.advanceTimersByTimeAsync(0);
      const items = store.libraryMenu()?.menu.items ?? [];
      const codes = items.map((i: any) => i.code);
      expect(codes).toEqual([...codes].sort());
    });
  });
});
