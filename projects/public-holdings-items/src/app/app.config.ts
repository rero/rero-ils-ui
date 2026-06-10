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

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { provideLoadingBar } from '@ngx-loading-bar/core';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreTranslateLoader, NgCoreTranslateService, primeNGConfig, provideCore } from '@rero/ng-core';
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
      loader: provideTranslateLoader(CoreTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
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
