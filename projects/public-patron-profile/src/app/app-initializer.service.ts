// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppConfigService } from '@app/admin/service/app-config.service';
import { PatronProfileStore } from '@app/public-search/patron-profile/store/patron-profile.store';
import { AppStore, AppTranslateLanguageService } from '@rero/shared';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private appStore = inject(AppStore);
  private store = inject(PatronProfileStore);
  private translateService = inject(NgCoreTranslateService);
  private translateLanguageService = inject(AppTranslateLanguageService);
  private appConfigService = inject(AppConfigService);

  load(): Observable<any> {
    return this.appStore.load().pipe(
      tap(() => {
        const user = this.appStore.user();
        if (user) this.store.init(user);
      }),
      switchMap(() => this.initTranslateService())
    );
  }

  private initTranslateService(): Observable<any> {
    let language = this.appStore.settings()?.language;
    if (language == null) {
      const browserLang = this.translateService.getBrowserLang() ?? '';
      language = (browserLang && this.appStore.availableLanguageCodes().includes(browserLang))
        ? browserLang
        : this.appConfigService.defaultLanguage;
    }
    return from(this.translateLanguageService.loadLanguageNow(language)).pipe(
      switchMap(() => this.translateService.use(language))
    );
  }
}
