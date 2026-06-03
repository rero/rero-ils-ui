/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { CoreTranslateLoader, NgCoreTranslateService, TruncateTextPipe, primeNGConfig } from '@rero/ng-core';
import { AppStore, MainTitlePipe } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG(primeNGConfig),
    provideTranslateService({
      loader: provideTranslateLoader(CoreTranslateLoader),
    }),
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    provideAppInitializer(() => {
      return inject(AppStore).load();
    }),
    MainTitlePipe,
    TruncateTextPipe,
  ],
};
