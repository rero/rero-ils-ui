/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DoBootstrap, inject, Injector, NgModule, provideAppInitializer } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, primeNGConfig, TranslateLoader, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe, RemoteSearchComponent, SharedModule } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';
import { AppInitializerService } from './app-initializer.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
        deps: [CoreConfigService, HttpClient],
      },
      isolate: false,
    }),
    SharedModule,
  ],
  providers: [
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG(primeNGConfig),
    MainTitlePipe,
    TruncateTextPipe
  ],
})
export class AppModule implements DoBootstrap {
  private injector: Injector = inject(Injector);

  ngDoBootstrap(): void {
    if (!customElements.get('main-search-bar')) {
      const searchBar = createCustomElement(RemoteSearchComponent, { injector: this.injector });
      customElements.define('main-search-bar', searchBar);
    }
  }
}
