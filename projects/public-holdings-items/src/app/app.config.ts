// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { provideLoadingBar } from '@ngx-loading-bar/core';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreConfigService, NgCoreTranslateService, TranslateLanguageService, primeNGConfig, provideCore } from '@rero/ng-core';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([]),
    provideHttpClient(),
    providePrimeNG(primeNGConfig),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    provideFormlyCore(withFormlyPrimeNG()),
    provideLoadingBar({}),
    provideLoadingBarInterceptor(),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    provideCore(),
    { provide: CoreConfigService, useClass: AppConfigService },
  ],
};
