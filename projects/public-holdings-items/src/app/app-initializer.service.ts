// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStore, AppTranslateLanguageService } from '@rero/shared';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from './app-config-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private translateService = inject(TranslateService);
  private appStore = inject<InstanceType<typeof AppStore>>(AppStore);
  private translateLanguageService = inject(AppTranslateLanguageService);
  private appConfigService = inject(AppConfigService);

  load(): Observable<any> {
    return this.appStore.load().pipe(
      switchMap(() => this.initTranslateService())
    );
  }

  private initTranslateService(): Observable<any> {
    let language = this.appStore.settings()?.language;
    if (language == null) {
      const browserLang = this.translateService.getBrowserLang();
      language = (browserLang && this.appStore.availableLanguageCodes().includes(browserLang))
        ? browserLang
        : this.appConfigService.defaultLanguage;
    }
    return from(this.translateLanguageService.loadLanguageNow(language)).pipe(
      switchMap(() => this.translateService.use(language))
    );
  }
}
