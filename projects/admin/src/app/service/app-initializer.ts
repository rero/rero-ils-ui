// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore, User } from '@rero/shared';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { RemoteAutocompleteFactoryService } from '../record/editor/formly/primeng/remote-autocomplete/remote-autocomplete-factory.service';
import { LibrarySwitchStorageService } from '../menu/service/library-switch-storage.service';

export function initializeApp(): Observable<any> {
  const appStore = inject(AppStore);
  const appConfigService = inject(AppConfigService);
  const translateService = inject(NgCoreTranslateService);
  const remoteAutocompleteFactoryService = inject(RemoteAutocompleteFactoryService);
  const librarySwitchStorageService = inject(LibrarySwitchStorageService);

  return appStore.load().pipe(
    tap((user: User) => {
      remoteAutocompleteFactoryService.init();
      if (user.hasAdminUiAccess) {
        const libraries = user.patronLibrarian?.libraries ?? [];
        const library = libraries[0];
        if (librarySwitchStorageService.has()) {
          const currentLibraryCache = librarySwitchStorageService.get().currentLibrary;
          const cachedLibraryExists = libraries.some((lib: { pid: string }) => lib.pid === currentLibraryCache);
          if (cachedLibraryExists) {
            appStore.setCurrentLibrary(currentLibraryCache);
          } else {
            librarySwitchStorageService.remove();
            appStore.setCurrentLibrary(library.pid);
          }
        } else {
          appStore.setCurrentLibrary(library.pid);
        }
        const organisationPid = user.patronLibrarian?.organisation?.pid;
        const budgetPid = user.patronLibrarian?.organisation?.budget?.pid;
        if (organisationPid) { appStore.setCurrentOrganisation(organisationPid); }
        if (budgetPid) { appStore.setCurrentBudget(budgetPid); }
      }
    }),
    switchMap(() => {
      let language = appStore.settings()?.language;
      if (language == null) {
        const browserLang = translateService.getBrowserLang();
        language = (browserLang && browserLang.match(appConfigService.languages.join('|')))
          ? browserLang
          : appConfigService.defaultLanguage;
      }
      return translateService.use(language);
    })
  );
}
