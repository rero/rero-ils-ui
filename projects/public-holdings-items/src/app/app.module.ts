/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, inject, Injector, NgModule, provideAppInitializer } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CoreConfigService,
  CoreModule,
  NgCoreTranslateService,
  primeNGConfig,
  RecordModule,
  TranslateLoader,
} from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { providePrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { DocumentDetailViewComponent } from 'projects/public-search/src/app/document-detail/document-detail-view/document-detail-view.component';
import { ElectronicHoldingsComponent } from 'projects/public-search/src/app/document-detail/document-detail-view/holdings/electronic-holdings/electronic-holdings.component';
import { HoldingsComponent } from 'projects/public-search/src/app/document-detail/holdings/holdings.component';
import { ItemsComponent } from 'projects/public-search/src/app/document-detail/holdings/items/items.component';
import { ItemComponent } from 'projects/public-search/src/app/document-detail/item/item.component';
import { PickupLocationComponent } from 'projects/public-search/src/app/document-detail/request/pickup-location/pickup-location.component';
import { HoldingsRequestComponent } from 'projects/public-search/src/app/document-detail/request/holdings-request.component';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';
import { ItemRequestComponent } from 'projects/public-search/src/app/document-detail/item/item-request.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        AccordionModule,
        TabsModule,
        CardModule,
        MessageModule,
        MenubarModule,
        BrowserModule,
        BrowserAnimationsModule,
        DividerModule,
        RouterModule.forRoot([]),
        FormsModule,
        FormlyModule.forRoot(),
        FormlyPrimeNGModule,
        CoreModule,
        RecordModule,
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
        LoadingBarHttpClientModule,
        LoadingBarModule,
        HoldingsComponent,
        ItemComponent,
        ItemsComponent,
        PickupLocationComponent,
        HoldingsRequestComponent,
        DocumentDetailViewComponent,
        ElectronicHoldingsComponent,
        ItemRequestComponent
    ],
    providers: [
        provideAppInitializer(() => {
            const appInitializerService = inject(AppInitializerService);
            return appInitializerService.load();
        }),
        { provide: TranslateService, useClass: NgCoreTranslateService },
        { provide: CoreConfigService, useClass: AppConfigService },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        providePrimeNG(primeNGConfig),
    ],
})
export class AppModule implements DoBootstrap {
  private injector: Injector = inject(Injector);

  ngDoBootstrap(): void {
    if (!customElements.get('public-search-document')) {
      const searchBar = createCustomElement(DocumentDetailViewComponent, { injector: this.injector });
      customElements.define('public-search-document', searchBar);
    }
  }
}
