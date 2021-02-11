/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { CoreConfigService } from '@rero/ng-core';

import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { IContextSettings } from '@rero/shared';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends CoreConfigService {

  private settings: IContextSettings;

  public adminRoles: Array<string>;

  public sessionExpiredSeconds: number;

  public librarySwitchCheckParamsUrl: string[];

  constructor() {
    super();
    this.production = environment.production;
    this.apiBaseUrl = environment.apiBaseUrl;
    this.$refPrefix = environment.$refPrefix;
    this.schemaFormEndpoint = '/schemas';
    this.languages = environment.languages;
    this.defaultLanguage = environment.defaultLanguage;
    this.adminRoles = environment.adminRoles;
    this.sessionExpiredSeconds = environment.sessionExpiredSeconds;
    this.translationsURLs = environment.translationsURLs;
    this.librarySwitchCheckParamsUrl = environment.librarySwitchCheckParamsUrl;
  }

  public setSettings(settings: IContextSettings) {
    this.settings = settings;
  }

  public getSettings() {
    return this.settings;
  }

  public getSetting(name: string) {
    if (!(name in this.settings)) {
      return throwError('Missing setting key: ' + name);
    }
    return this.settings[name];
  }
}
