/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { APP_INITIALIZER, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, RecordModule, TranslateLoader, TranslateService } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionBriefComponent } from './collection-brief/collection-brief.component';
import { DocumentBriefComponent } from './document-brief/document-brief.component';
import { DocumentRecordSearchComponent } from './document-record-search/document-record-search.component';
import { ErrorPageComponent } from './error/error-page.component';
import { MainComponent } from './main/main.component';
import { SearchBarComponent } from './search-bar/search-bar.component';


/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


@NgModule({
  declarations: [
    AppComponent,
    DocumentBriefComponent,
    MainComponent,
    CollectionBriefComponent,
    ErrorPageComponent,
    DocumentRecordSearchComponent,
    SearchBarComponent
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
    TypeaheadModule.forRoot(),
    SharedModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true },
    { provide: CoreConfigService, useClass: AppConfigService },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.currentLanguage,
      deps: [TranslateService]
    },
    BsLocaleService
  ],
  entryComponents: [
    DocumentBriefComponent,
    CollectionBriefComponent,
    ErrorPageComponent,
    DocumentRecordSearchComponent,
    SearchBarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private injector: Injector) {
    const searchBar = createCustomElement(SearchBarComponent, { injector: this.injector });
    customElements.define('main-search-bar', searchBar);
  }

}
