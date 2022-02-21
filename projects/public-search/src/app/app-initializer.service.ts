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
import { TranslateService } from '@rero/ng-core';
import { AppSettingsService, UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { RouteCollectionService } from './routes/route-collection.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  /**
   * Constructor
   * @param _routeCollectionService - RouteCollectionService
   * @param _userService - UserService
   * @param _appSettingsService - AppSettingsService
   * @param _translateService - TranslateService
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private _routeCollectionService: RouteCollectionService,
    private _userService: UserService,
    private _appSettingsService: AppSettingsService,
    private _translateService: TranslateService,
    private _appConfigService: AppConfigService

  ) { }

  /** load */
  load(): Observable<any> {
    return this._userService.load().pipe(
      tap(() => {
        this._routeCollectionService.load();
      }),
      switchMap(() => this.initTranslateService())
    );
  }

  /** Initialize Translate Service */
  private initTranslateService(): Observable<any> {
    let language = this._appSettingsService.settings.language;
    if (language == null) {
      const browserLang = this._translateService.getBrowserLang();
      language = browserLang.match(this._appConfigService.languages.join('|')) ?
        browserLang : this._appConfigService.defaultLanguage;
    }
    return this._translateService.setLanguage(language);
  }
}
