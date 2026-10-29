// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { patronProfileRoutes } from '@app/public-search/routes/patron-profile-routes';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { provideOptimus } from '@openng/optimus-ui/config';
import { CoreConfigService, NgCoreTranslateService, optimusUIConfig, TranslateLanguageService } from '@rero/ng-core';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService } from '@rero/shared';

import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(patronProfileRoutes),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideOptimus(optimusUIConfig),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    provideLoadingBarInterceptor(),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: CoreConfigService, useClass: AppConfigService },
    ConfirmationService,
    MessageService,
  ],
};
