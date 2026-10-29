// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { provideOptimus } from '@openng/optimus-ui/config';
import {
  CoreConfigService,
  httpPendingInterceptor,
  NgCoreTranslateService,
  optimusUIConfig,
  TranslateLanguageService,
  TruncateTextPipe,
} from '@rero/ng-core';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService, MainTitlePipe } from '@rero/shared';

import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    provideHttpClient(withXhr(), withInterceptors([httpPendingInterceptor]), withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    provideOptimus(optimusUIConfig),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    { provide: CoreConfigService, useClass: AppConfigService },
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.getCurrentLang(),
      deps: [TranslateService],
    },
    MainTitlePipe,
    TruncateTextPipe,
    ConfirmationService,
    MessageService,
  ],
};
