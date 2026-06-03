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

import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslationObject } from '@ngx-translate/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private appStore = inject(AppStore);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private appConfigService: AppConfigService = inject(AppConfigService);

  load(): Observable<InterpolatableTranslationObject> {
    return this.appStore.load().pipe(
      switchMap(() => this.initTranslateService())
    );
  }

  private initTranslateService(): Observable<InterpolatableTranslationObject> {
    let language = this.appStore.settings()?.language;
    if (language == null) {
      language = this.appConfigService.defaultLanguage;
      const browserLang = this.translateService.getBrowserLang();
      if (browserLang) {
        language = browserLang.match(this.appConfigService.languages.join('|'))
          ? browserLang
          : this.appConfigService.defaultLanguage;
      }
    }
    return this.translateService.use(language);
  }
}
