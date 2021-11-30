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
import { AppConfigService } from 'projects/admin/src/app/service/app-config.service';
import { PatronProfileMenuService } from 'projects/public-search/src/app/patron-profile/patron-profile-menu.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  /**
   * Constructor
   * @param _userService - UserService
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _userService: UserService,
    private _patronProfileMenuService: PatronProfileMenuService,
    private _translateService: TranslateService,
    private _appSettingsService: AppSettingsService,
    private _appConfigService: AppConfigService
  ) { }

    /** load */
    load(): Observable<any> {
      return this._userService.load().pipe(
        tap(() => {
          this._patronProfileMenuService.init();
          this.initTranslateService();
        })
      );
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
