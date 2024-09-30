/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { PatronProfileMenuService } from 'projects/public-search/src/app/patron-profile/patron-profile-menu.service';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private userService: UserService = inject(UserService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private translateService: TranslateService = inject(TranslateService);
  private appSettingsService: AppSettingsService = inject(AppSettingsService);
  private appConfigService: AppConfigService = inject(AppConfigService);

  load(): Observable<any> {
    return this.userService.load().pipe(
      tap(() => {
        this.patronProfileMenuService.init();
      }),
      switchMap(() => this.initTranslateService())
    );
  }

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
