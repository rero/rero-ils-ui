// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { AppConfigService } from '@app/admin/service/app-config.service';
import { PatronProfileStore } from '@app/public-search/patron-profile/store/patron-profile.store';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private appStore = inject(AppStore);
  private store = inject(PatronProfileStore);
  private translateService = inject(NgCoreTranslateService);
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
      language = browserLang.match(this.appConfigService.languages.join('|'))
        ? browserLang
        : this.appConfigService.defaultLanguage;
    }
    return this.translateService.use(language);
  }
}
