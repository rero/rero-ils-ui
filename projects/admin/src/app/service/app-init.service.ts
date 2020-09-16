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
import { User } from '../class/user';
import { AppConfigService } from './app-config.service';
import { OrganisationService } from './organisation.service';
import { UserService } from './user.service';

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
   */
  constructor(
    private _userService: UserService,
    private _appConfigService: AppConfigService,
    private _translateService: TranslateService,
    private _organisationService: OrganisationService,
    private _localeStorageService: LocalStorageService
  ) { }

  /**
   * Function called when launching the application
   */
  load() {
    return new Promise((resolve) => {
      this._userService.loadLoggedUser();
      this._userService.onUserLoaded$.subscribe((data: any) => {
        this._appConfigService.setSettings(data.settings);
        this.initTranslateService();
        // User is logged
        if (data.metadata) {
          if (this._userService.allowAccess) {
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
      const user = this._userService.getCurrentUser();
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
