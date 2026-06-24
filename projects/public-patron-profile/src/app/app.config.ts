// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerFormlyExtension } from '@app/admin/acquisition/formly/extension';
import {
  fieldPasswordMatchValidator,
} from '@app/public-search/patron-profile/patron-profile-password/patron-profile-password.component';
import { patronProfileRoutes } from '@app/public-search/routes/patron-profile-routes';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreConfigService, NgCoreTranslateService, TranslateLanguageService, primeNGConfig, registerNgCoreFormlyExtension, withNgCoreFormly } from '@rero/ng-core';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService } from '@rero/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(patronProfileRoutes),
    provideHttpClient(),
    provideFormlyCore([
      ...withNgCoreFormly() as any,
      {
        validators: [
          { name: 'passwordMatch', validation: fieldPasswordMatchValidator }
        ],
      }
    ]),
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerNgCoreFormlyExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormlyExtension,
      deps: [TranslateService],
    },
    providePrimeNG(primeNGConfig),
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
