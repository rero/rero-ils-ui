// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreTranslateLoader, NgCoreTranslateService, TruncateTextPipe, primeNGConfig } from '@rero/ng-core';
import { AppStore, MainTitlePipe } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    providePrimeNG(primeNGConfig),
    provideTranslateService({
      loader: provideTranslateLoader(CoreTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    provideAppInitializer(() => {
      return inject(AppStore).load();
    }),
    MainTitlePipe,
    TruncateTextPipe,
  ],
};
