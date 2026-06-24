// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslationObject } from '@ngx-translate/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore, AppTranslateLanguageService } from '@rero/shared';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private appStore = inject(AppStore);
  private translateService = inject(NgCoreTranslateService);
  private translateLanguageService = inject(AppTranslateLanguageService);
  private appConfigService = inject(AppConfigService);

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
        language = this.appStore.availableLanguageCodes().includes(browserLang)
          ? browserLang
          : this.appConfigService.defaultLanguage;
      }
    }
    return from(this.translateLanguageService.loadLanguageNow(language)).pipe(
      switchMap(() => this.translateService.use(language))
    );
  }
}
