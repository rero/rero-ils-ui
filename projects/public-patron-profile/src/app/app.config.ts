/*
 * RERO ILS UI
 * Copyright (C) 2021-2026 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreTranslateLoader, NgCoreTranslateService, primeNGConfig, registerNgCoreFormlyExtension, withNgCoreFormly } from '@rero/ng-core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import {
  fieldPasswordMatchValidator,
} from '@app/public-search/patron-profile/patron-profile-password/patron-profile-password.component';
import { patronProfileRoutes } from '@app/public-search/routes/patron-profile-routes';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';
import { registerFormlyExtension } from '@app/admin/acquisition/formly/extension';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(patronProfileRoutes),
    provideHttpClient(withInterceptorsFromDi()),
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
      loader: provideTranslateLoader(CoreTranslateLoader),
    }),
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
