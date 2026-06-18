// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
