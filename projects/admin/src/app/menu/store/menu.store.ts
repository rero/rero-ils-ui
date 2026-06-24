// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import type { EsResult } from '@rero/ng-core';
import { AppStore, PERMISSION_OPERATOR } from '@rero/shared';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { cloneDeep } from 'lodash-es';
import { MenuItem } from 'primeng/api';
import { of, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LibraryApiService } from '../api/library-api.service';
import { MENU_IDS } from '../menu-definition/menu-ids';
import { LibrarySwitchStorageService } from '../service/library-switch-storage.service';

export type ISwitchLibrary = {
  pid: string;
  code: string;
  name: string;
};

type LibraryRecord = {
  metadata: {
    pid: string;
    code: string;
    name: string;
  };
};

type LibraryMenuData = {
  menu: MenuItem;
  libraryActive: ISwitchLibrary;
};

type MenuState = {
  applicationMenuItems: MenuItem[];
  selectedLibrary: ISwitchLibrary | null;
  logoutCounter: number;
  libraries: LibraryRecord[];
};

function resolveActiveLibrary(
  libraries: LibraryRecord[],
  selectedLibrary: ISwitchLibrary | null,
  currentLibraryPid: string | null,
  librarySwitchStorageService: LibrarySwitchStorageService
): ISwitchLibrary | undefined {
  if (selectedLibrary) {
    return selectedLibrary;
  }

  let libraryActive: LibraryRecord | undefined;

  if (!librarySwitchStorageService.has()) {
    libraryActive = libraries.find((l) => l.metadata.pid === currentLibraryPid);
  } else {
    const data = librarySwitchStorageService.get();
    libraryActive = libraries.find((l) => l.metadata.pid === data.currentLibrary);
    if (!libraryActive) {
      libraryActive = libraries.find((l) => l.metadata.pid === currentLibraryPid);
    }
  }

  if (!libraryActive) {
    return undefined;
  }

  return {
    pid: libraryActive.metadata.pid,
    code: libraryActive.metadata.code,
    name: libraryActive.metadata.name,
  };
}

function updateQueryParams(menuItems: MenuItem[], library: ISwitchLibrary, libraryKeys: string[]): MenuItem[] {
  menuItems.forEach((item: MenuItem) => {
    if (item.queryParams) {
      const qp = item.queryParams as Record<string, unknown>;
      Object.keys(qp).forEach((key: string) => {
        if (libraryKeys.includes(key)) {
          qp[key] = library.pid;
        }
      });
    }
    if (item.items) {
      item.items = updateQueryParams(item.items, library, libraryKeys);
    }
  });
  return menuItems;
}

export const MenuStore = signalStore(
  { providedIn: 'root' },
  withState<MenuState>({
    applicationMenuItems: [],
    selectedLibrary: null,
    logoutCounter: 0,
    libraries: [],
  }),
  withMethods((
    store,
    appStore = inject(AppStore),
    librarySwitchStorageService = inject(LibrarySwitchStorageService),
    libraryApiService = inject(LibraryApiService),
    translateService = inject(TranslateService),
    httpClient = inject(HttpClient)
  ) => {
    const libraryKeys = ['library', 'owner_library', 'owning_library'];

    function processMenuApp(menuItems: MenuItem[]): MenuItem[] {
      return menuItems
        .map((item: MenuItem) => {
          if (item.access) {
            const canAccess = appStore.canAccess(
              item.access.permissions,
              item.access.operator || PERMISSION_OPERATOR.OR
            );
            if (!canAccess) {
              return undefined;
            }
          }
          delete item['access'];
          if (!item.url && !item.routerLink && item.items) {
            item.items = processMenuApp(item.items).filter((i): i is MenuItem => !!i);
          }
          return item;
        })
        .filter((item): item is MenuItem => !!item);
    }

    return {
      switchLibrary(library: ISwitchLibrary): void {
        librarySwitchStorageService.save({
          userId: appStore.user()!.id,
          currentLibrary: library.pid,
          libraryName: library.name,
        });
        appStore.setCurrentLibrary(library.pid);
        const menuItems = cloneDeep(store.applicationMenuItems());
        const item = menuItems
          .find((m: MenuItem) => m.id === MENU_IDS.APP.ADMIN.MENU)?.items
          ?.find((m: MenuItem) => m.id === MENU_IDS.APP.ADMIN.MY_LIBRARY);
        if (item?.routerLink) {
          const routerLink = [...item.routerLink];
          routerLink[4] = library.pid;
          item.routerLink = routerLink;
        }
        patchState(store, {
          selectedLibrary: library,
          applicationMenuItems: updateQueryParams(menuItems, library, libraryKeys),
        });
      },

      clearSelectedLibrary(): void {
        patchState(store, { selectedLibrary: null });
      },

      generateAppMenu(menuItems: MenuItem[]): void {
        patchState(store, { applicationMenuItems: processMenuApp(cloneDeep(menuItems)) });
      },

      updateLibraryLink(library: ISwitchLibrary): void {
        const menuItems = cloneDeep(store.applicationMenuItems());
        const item = menuItems
          .find((m: MenuItem) => m.id === MENU_IDS.APP.ADMIN.MENU)?.items
          ?.find((m: MenuItem) => m.id === MENU_IDS.APP.ADMIN.MY_LIBRARY);

        if (!item?.routerLink) {
          return;
        }

        const routerLink = [...item.routerLink];
        routerLink[4] = library.pid;
        item.routerLink = routerLink;
        patchState(store, { applicationMenuItems: updateQueryParams(menuItems, library, libraryKeys) });
      },

      updateLibraryQueryParams(library: ISwitchLibrary): void {
        patchState(store, {
          applicationMenuItems: updateQueryParams(cloneDeep(store.applicationMenuItems()), library, libraryKeys),
        });
      },

      generateMenuLanguages(): MenuItem[] {
        const currentLanguage = translateService.getCurrentLang();
        return appStore.availableLanguageCodes()
          .map((language: string) => ({
            label: translateService.instant(`ui_language_${language}`),
            translateLabel: `ui_language_${language}`,
            id: `lang-${language}`,
            styleClass: currentLanguage === language ? 'ui:font-bold' : '',
            command: () => httpClient
              .post(`/language`, { lang: language })
              .subscribe(() => translateService.use(language)),
          }))
          .sort((a: MenuItem, b: MenuItem) => String(a.label).localeCompare(String(b.label)));
      },

      logout(): void {
        patchState(store, { logoutCounter: store.logoutCounter() + 1 });
      },

      loadLibraries: rxMethod<string[]>(pipe(
        switchMap((pids: string[]) => {
          if (pids.length === 0) {
            return of([] as LibraryRecord[]);
          }
          return libraryApiService.findByLibrariesPidAndOrderBy$(pids).pipe(
            map((results: EsResult) => results.hits.total.value > 0
              ? results.hits.hits.map((library) => ({
                metadata: {
                  pid: String(library.metadata['pid']),
                  code: String(library.metadata['code']),
                  name: String(library.metadata['name']),
                },
              }))
              : []
            )
          );
        }),
        tap((libraries: LibraryRecord[]) => patchState(store, { libraries }))
      )),
    };
  }),
  withComputed((
    store,
    librarySwitchStorageService = inject(LibrarySwitchStorageService),
    appStore = inject(AppStore)
  ) => ({
    libraryMenu: computed<LibraryMenuData | undefined>(() => {
      const libraries = store.libraries();
      if (libraries.length === 0) {
        return undefined;
      }

      const libraryActive = resolveActiveLibrary(
        libraries,
        store.selectedLibrary(),
        appStore.currentLibraryPid(),
        librarySwitchStorageService
      );
      if (!libraryActive) {
        return undefined;
      }

      return {
        menu: {
          label: libraryActive.code,
          icon: 'fa-solid fa-shuffle',
          id: MENU_IDS.LIBRARY_MENU,
          items: libraries
            .slice()
            .sort((a: LibraryRecord, b: LibraryRecord) => a.metadata.code.localeCompare(b.metadata.code))
            .map((library: LibraryRecord) => ({
              label: `[${library.metadata.code}] ${library.metadata.name}`,
              code: library.metadata.code,
              pid: library.metadata.pid,
              styleClass: library.metadata.pid === libraryActive.pid ? 'ui:font-bold' : '',
              command: () => store.switchLibrary({
                pid: library.metadata.pid,
                code: library.metadata.code,
                name: library.metadata.name,
              }),
            })),
        },
        libraryActive,
      };
    }),
  })),
  withHooks((store) => {
    const appStore = inject(AppStore);
    return {
      onInit: () => {
        store.loadLibraries(
          toObservable(appStore.user).pipe(
            map((user) => user?.patronLibrarian?.libraries.map((lib: { pid: string }) => lib.pid) ?? [])
          )
        );
      },
    };
  })
);
