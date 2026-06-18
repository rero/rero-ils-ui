// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormlyModule, provideFormlyCore } from '@ngx-formly/core';
import { TranslateLoader as BaseCoreTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreTranslateLoader, httpPendingInterceptor, NgCoreTranslateService, primeNGConfig, TruncateTextPipe, withNgCoreFormly } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
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
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: BaseCoreTranslateLoader,
          useClass: CoreTranslateLoader,
          deps: [CoreConfigService, HttpClient],
        },
        isolate: false,
      })
    ),
    provideFormlyCore(withNgCoreFormly() as any),
    importProvidersFrom(FormlyModule.forChild({})),
    providePrimeNG(primeNGConfig),
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    { provide: CoreConfigService, useClass: AppConfigService },
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: LOCALE_ID, useFactory: (translate: TranslateService) => translate.getCurrentLang(), deps: [TranslateService] },
    MainTitlePipe,
    TruncateTextPipe,
    ConfirmationService,
    MessageService,
  ]
};
