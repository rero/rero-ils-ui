/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService, UserService } from '@rero/shared';
import { AppConfigService } from 'projects/admin/src/app/service/app-config.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);
  private appSettingsService: AppSettingsService = inject(AppSettingsService);
  private appConfigService: AppConfigService = inject(AppConfigService);

    load(): Observable<any> {
      return this.userService.load().pipe(
        switchMap(() => this.initTranslateService())
      );
    }

  private initTranslateService(): Observable<any> {
    const {language} = this.appSettingsService.settings;
    if (language) {
      return this.translateService.use(language);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      return this.translateService.use(
        browserLang.match(this.appConfigService.languages.join('|')) ?
          browserLang : this.appConfigService.defaultLanguage
      );
    }
  }
}
