// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient, withXhr } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import {
  CoreConfigService,
  NgCoreTranslateService,
  optimusUIConfig,
  TranslateLanguageService,
  TruncateTextPipe,
} from '@rero/ng-core';
import {
  AppStore,
  AppTranslateLanguageService,
  AppTranslateLoader,
  AppTranslateService,
  MainTitlePipe,
} from '@rero/shared';

import { AppConfigService } from './app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    { provide: CoreConfigService, useExisting: AppConfigService },
    provideZonelessChangeDetection(),
    provideHttpClient(withXhr()),
    provideOptimus(optimusUIConfig),
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
