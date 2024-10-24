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

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, inject, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateLoader as BaseTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BucketNameService as CoreBucketNameService, CoreConfigService, NgCoreTranslateService, RecordModule, TranslateLoader } from '@rero/ng-core';
import { RemoteSearchComponent, SharedModule, UserService } from '@rero/shared';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionBriefComponent } from './collection-brief/collection-brief.component';
import { DocumentBriefComponent } from './document-brief/document-brief.component';
import { DocumentRecordSearchComponent } from './document-record-search/document-record-search.component';
import { ErrorPageComponent } from './error/error-page.component';
import { CustomRequestInterceptor } from './interceptor/custom-request.interceptor';
import { MainComponent } from './main/main.component';
import { BucketNameService } from './service/bucket-name.service';
import { Observable } from 'rxjs';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService): () => Observable<any> {
  return () => appInitializerService.load();
}

@NgModule({
    declarations: [
        AppComponent,
        DocumentBriefComponent,
        MainComponent,
        CollectionBriefComponent,
        ErrorPageComponent,
        DocumentRecordSearchComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        RecordModule,
        TranslateModule.forRoot({
            loader: {
                provide: BaseTranslateLoader,
                useClass: TranslateLoader,
                deps: [CoreConfigService, HttpClient]
            },
            isolate: false
        }),
        SharedModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        LoadingBarModule
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService, UserService], multi: true },
        { provide: CoreConfigService, useClass: AppConfigService },
        { provide: TranslateService, useClass: NgCoreTranslateService },
        { provide: LOCALE_ID, useFactory: (translate: TranslateService) => translate.currentLang, deps: [TranslateService] },
        { provide: HTTP_INTERCEPTORS, useClass: CustomRequestInterceptor, multi: true },
        { provide: CoreBucketNameService, useClass: BucketNameService },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule implements DoBootstrap {

  private injector: Injector = inject(Injector);

  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(AppComponent);
    if (!customElements.get('main-search-bar')) {
      const searchBar = createCustomElement(RemoteSearchComponent, { injector: this.injector });
      customElements.define('main-search-bar', searchBar);
    }
  }
}
