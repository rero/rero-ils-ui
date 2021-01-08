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
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, RecordModule, TranslateLoader } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BookComponent } from 'projects/public-search/src/app/document-detail/book/book.component';
import { HoldingsItemsComponent } from 'projects/public-search/src/app/document-detail/holdings-items/holdings-items.component';
import { HoldingComponent } from 'projects/public-search/src/app/document-detail/holdings/holding/holding.component';
import { HoldingsComponent } from 'projects/public-search/src/app/document-detail/holdings/holdings.component';
import { ItemsComponent } from 'projects/public-search/src/app/document-detail/holdings/items/items.component';
import { ItemComponent } from 'projects/public-search/src/app/document-detail/item/item.component';
import { PickupLocationComponent } from 'projects/public-search/src/app/document-detail/request/pickup-location/pickup-location.component';
import { RequestComponent } from 'projects/public-search/src/app/document-detail/request/request.component';
import { NotesFilterPipe } from 'projects/public-search/src/app/pipe/notes-filter.pipe';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


@NgModule({
  declarations: [
    BookComponent,
    HoldingsItemsComponent,
    HoldingsComponent,
    ItemComponent,
    ItemsComponent,
    HoldingComponent,
    RequestComponent,
    PickupLocationComponent,
    NotesFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    FormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    CoreModule,
    RecordModule,
    ReactiveFormsModule,
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
    {
      provide: CoreConfigService,
      useClass: AppConfigService
    }
  ],
  entryComponents: [
    BookComponent,
    HoldingsItemsComponent,
    HoldingsComponent,
    ItemComponent,
    ItemsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    if (!customElements.get('public-holdings-items')) {
      const searchBar = createCustomElement(HoldingsItemsComponent, { injector: this.injector });
      customElements.define('public-holdings-items', searchBar);
    }
  }
}
