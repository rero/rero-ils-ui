/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
