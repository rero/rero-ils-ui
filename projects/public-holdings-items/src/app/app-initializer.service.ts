/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { TranslateService } from '@rero/ng-core';
import { AppSettingsService, UserService } from '@rero/shared';
import { AppConfigService } from './app-config-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _userService - UserService
   * @param _appSettingsService - AppSettingsService
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private _translateService: TranslateService,
    private _userService: UserService,
    private _appSettingsService: AppSettingsService,
    private _appConfigService: AppConfigService
  ) { }

  /** Load */
  load(): Promise<boolean> {
    return new Promise((resolve) => {
      this._userService.loaded$.subscribe(() => {
        this.initTranslateService();
      });
      this._userService.load();
      resolve(true);
    });
  }

  /** Initialize Translate Service */
  private initTranslateService(): void {
    const language = this._appSettingsService.settings.language;
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
}
