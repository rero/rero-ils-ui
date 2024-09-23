/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppSettingsService, User, UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private userService: UserService = inject(UserService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private appSettingsService: AppSettingsService = inject(AppSettingsService);
  private appConfigService: AppConfigService = inject(AppConfigService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);

  /**
   * Function called when launching the application
   */
  load(): Observable<any> {
    return this.userService.load().pipe(
      tap((user: User) => {
        // TODO: Replace Typeahead with remote-autocomplete
        //this._typeaheadFactoryService.init();
        if (user.hasAdminUiAccess) {
          // Set current library and organisation for librarian or system_librarian roles
          const library = user.patronLibrarian.libraries[0];
          user.currentLibrary = library.pid;
          user.currentOrganisation = user.patronLibrarian.organisation.pid;
          user.currentBudget = user.patronLibrarian.organisation.budget.pid;
          this.organisationService.loadOrganisationByPid(user.currentOrganisation);
        }
      }),
      switchMap(() => this.initTranslateService())
    );
  }

  /** Initialize Translate Service */
  private initTranslateService(): Observable<any> {
    let {language} = this.appSettingsService.settings;
    if (language == null) {
      const browserLang = this.translateService.getBrowserLang();
      language = browserLang.match(this.appConfigService.languages.join('|')) ?
        browserLang : this.appConfigService.defaultLanguage;
    }

    return this.translateService.use(language);
  }
}
