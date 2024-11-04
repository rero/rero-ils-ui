/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, DoBootstrap, inject, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, TranslateLoader } from '@rero/ng-core';
import { RemoteSearchComponent, SharedModule } from '@rero/shared';
import { Observable } from 'rxjs';
import { AppInitializerService } from './app-initializer.service';
import { RouterModule } from '@angular/router';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService): () => Observable<any> {
  return () => appInitializerService.load();
}

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: BaseTranslateLoader,
                useClass: TranslateLoader,
                deps: [CoreConfigService, HttpClient]
            },
            isolate: false
        }),
        SharedModule
    ],
    providers: [
        // TODO: remove this to avoid api call. It still needed because
        //       `_getContributionName` need API config.
        { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true }
    ]
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
