// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreConfigService, NgCoreTranslateService, TranslateLanguageService, TruncateTextPipe, primeNGConfig } from '@rero/ng-core';
import { AppStore, AppTranslateLanguageService, AppTranslateLoader, AppTranslateService, MainTitlePipe } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';
import { AppConfigService } from './app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    { provide: CoreConfigService, useExisting: AppConfigService },
    provideZonelessChangeDetection(),
    provideHttpClient(),
    providePrimeNG(primeNGConfig),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    provideAppInitializer(() => {
      return inject(AppStore).load();
    }),
    MainTitlePipe,
    TruncateTextPipe,
  ],
};
