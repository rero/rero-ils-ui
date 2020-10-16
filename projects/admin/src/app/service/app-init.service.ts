/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Injectable } from '@angular/core';
import { LocalStorageService, TranslateService } from '@rero/ng-core';
import { LoggedUserService, SharedConfigService, User, UserService } from '@rero/shared';
import { AppConfigService } from './app-config.service';
import { LibrarySwitchService } from './library-switch.service';
import { OrganisationService } from './organisation.service';
import { TypeaheadFactoryService } from './typeahead-factory.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  /**
   * Constructor
   * @param _userService - UserService
   * @param _appConfigService - AppConfigService
   * @param _translateService - TranslateService
   * @param _organisationService - OrganisationService
   * @param _localeStorageService - LocalStorageService
   * @param _librarySwitchService - LibrarySwitchService
   * @param _loggedUserService - LoggedUserService
   * @param _sharedConfigService - SharedConfigService
   * @param _typeaheadFactoryService - TypeaheadFactoryService
   */
  constructor(
    private _userService: UserService,
    private _appConfigService: AppConfigService,
    private _translateService: TranslateService,
    private _organisationService: OrganisationService,
    private _localeStorageService: LocalStorageService,
    private _librarySwitchService: LibrarySwitchService,
    private _loggedUserService: LoggedUserService,
    private _sharedConfigService: SharedConfigService,
    private _typeaheadFactoryService: TypeaheadFactoryService
  ) { }

  /**
   * Function called when launching the application
   */
  load() {
    return new Promise((resolve) => {
      this._typeaheadFactoryService.init();
      this._userService.init();
      this._sharedConfigService.init();
      this._loggedUserService.load();
      this._loggedUserService.onLoggedUserLoaded$.subscribe((data: any) => {
        this._appConfigService.setSettings(data.settings);
        this.initTranslateService();
        // User is logged
        if (data.metadata) {
          if (this._userService.user.adminInterfaceAccess) {
            this._librarySwitchService.switch(data.metadata.library.pid);
            this._organisationService.loadOrganisationByPid(
              data.metadata.library.organisation.pid
            );
            this.initializeLocaleStorage();
          }
        }
      });
      resolve();
    });
  }

  /** Initialize Translate Service */
  private initTranslateService() {
    const language = this._appConfigService.getSettings().language;
    if (language) {
      this._translateService.setLanguage(language);
    } else {
      const browserLang = this._translateService.getBrowserLang();
      this._translateService.setLanguage(
        browserLang.match(this._appConfigService.languages.join('|')) ?
        browserLang : this._appConfigService.defaultLanguage
      );
    }
  }

  /** Initialize locale storage */
  private initializeLocaleStorage() {
    this._organisationService.onOrganisationLoaded.subscribe(() => {
      const user = this._userService.user;
      if (!this._localeStorageService.has(User.STORAGE_KEY)) {
        this._localeStorageService.set(User.STORAGE_KEY, user);
      } else {
        const userLocal = this._localeStorageService.get(User.STORAGE_KEY);
        if (userLocal.pid !== user.pid) {
          this._localeStorageService.set(User.STORAGE_KEY, user);
        }
        const locale = this._localeStorageService.get(User.STORAGE_KEY);
        user.setCurrentLibrary(locale.currentLibrary);
      }
    });
  }
}
