// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLoadingBar } from '@ngx-loading-bar/core';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import {
  CoreConfigService,
  NgCoreTranslateService,
  optimusUIConfig,
  provideCore,
  TranslateLanguageService,
} from '@rero/ng-core';
import { provideCoreFormly } from '@rero/ng-core/editor';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService } from '@rero/shared';

import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([]),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideOptimus(optimusUIConfig),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    provideLoadingBar({}),
    provideLoadingBarInterceptor(),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    provideCore(),
    // The request form of the document detail view uses the Formly types of ng-core.
    provideCoreFormly(),
    { provide: CoreConfigService, useClass: AppConfigService },
  ],
};
