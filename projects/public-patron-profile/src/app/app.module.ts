/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, RecordModule, TranslateLoader } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PatronProfileDocumentComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-document/patron-profile-document.component';
import { PatronProfileFeeComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-fees/patron-profile-fee/patron-profile-fee.component';
import {
  PatronProfileFeesComponent
} from 'projects/public-search/src/app/patron-profile/patron-profile-fees/patron-profile-fees.component';
import { PatronProfileHistoriesComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-histories/patron-profile-histories.component';
import { PatronProfileHistoryComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-histories/patron-profile-history/patron-profile-history.component';
import { PatronProfileIllRequestComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-ill-requests/patron-profile-ill-request/patron-profile-ill-request.component';
import { PatronProfileIllRequestsComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-ill-requests/patron-profile-ill-requests.component';
import {
  PatronProfileLoanComponent
} from 'projects/public-search/src/app/patron-profile/patron-profile-loans/patron-profile-loan/patron-profile-loan.component';
import {
  PatronProfileLoansComponent
} from 'projects/public-search/src/app/patron-profile/patron-profile-loans/patron-profile-loans.component';
import { PatronProfileMessageComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-message/patron-profile-message.component';
import { PatronProfilePersonalComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal/patron-profile-personal.component';
import { PatronProfileRequestComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-request/patron-profile-request.component';
import { PatronProfileRequestsComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-requests.component';
import { PatronProfileComponent } from 'projects/public-search/src/app/patron-profile/patron-profile.component';
import { ArrayTranslatePipe } from 'projects/public-search/src/app/pipe/array-translate.pipe';
import { ContributionFilterPipe } from 'projects/public-search/src/app/pipe/contribution-filter.pipe';
import { NotesFilterPipe } from 'projects/public-search/src/app/pipe/notes-filter.pipe';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


@NgModule({
  declarations: [
    PatronProfileComponent,
    PatronProfileMessageComponent,
    PatronProfileLoansComponent,
    PatronProfileLoanComponent,
    PatronProfilePersonalComponent,
    PatronProfileRequestsComponent,
    PatronProfileRequestComponent,
    PatronProfileFeesComponent,
    PatronProfileFeeComponent,
    PatronProfileHistoriesComponent,
    PatronProfileIllRequestsComponent,
    PatronProfileIllRequestComponent,
    NotesFilterPipe,
    ContributionFilterPipe,
    ArrayTranslatePipe,
    PatronProfileDocumentComponent,
    PatronProfileHistoryComponent
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
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SharedModule,
    LoadingBarHttpClientModule,
    LoadingBarModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true },
    { provide: CoreConfigService, useClass: AppConfigService }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    if (!customElements.get('public-patron-profile')) {
      const element = createCustomElement(PatronProfileComponent, { injector: this.injector });
      customElements.define('public-patron-profile', element);
    }
  }
}
