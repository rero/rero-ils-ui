// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormlyModule, provideFormlyCore } from '@ngx-formly/core';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, httpPendingInterceptor, NgCoreTranslateService, primeNGConfig, TranslateLanguageService, TruncateTextPipe, withNgCoreFormly } from '@rero/ng-core';
import { AppTranslateLanguageService, AppTranslateLoader, AppTranslateService, MainTitlePipe } from '@rero/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([httpPendingInterceptor])),
    provideTranslateService({
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    provideFormlyCore(withNgCoreFormly() as any),
    importProvidersFrom(FormlyModule.forChild({})),
    providePrimeNG(primeNGConfig),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    { provide: CoreConfigService, useClass: AppConfigService },
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: NgCoreTranslateService, useExisting: AppTranslateService },
    { provide: TranslateLanguageService, useExisting: AppTranslateLanguageService },
    { provide: LOCALE_ID, useFactory: (translate: TranslateService) => translate.getCurrentLang(), deps: [TranslateService] },
    MainTitlePipe,
    TruncateTextPipe,
    ConfirmationService,
    MessageService,
  ]
};
