// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Injectable, inject } from '@angular/core';
import { AppStore } from '@rero/shared';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from './app-config-service.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  private translateService = inject(TranslateService);
  private appStore = inject<InstanceType<typeof AppStore>>(AppStore);
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
      language = browserLang.match(this.appConfigService.languages.join('|'))
        ? browserLang
        : this.appConfigService.defaultLanguage;
    }
    return this.translateService.use(language);
  }
}
