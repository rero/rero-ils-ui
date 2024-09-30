/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, inject, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, NgCoreTranslateService, RecordModule, TranslateLoader } from '@rero/ng-core';
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
import {
  PatronProfileMenuComponent
} from 'projects/public-search/src/app/patron-profile/patron-profile-menu/patron-profile-menu.component';
import { PatronProfileMessageComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-message/patron-profile-message.component';
import { PatronProfilePersonalComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal/patron-profile-personal.component';
import { PatronProfileRequestComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-request/patron-profile-request.component';
import { PatronProfileRequestsComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-requests.component';
import { PatronProfileComponent } from 'projects/public-search/src/app/patron-profile/patron-profile.component';
import { ArrayTranslatePipe } from 'projects/public-search/src/app/pipe/array-translate.pipe';
import { JournalVolumePipe } from 'projects/public-search/src/app/pipe/journal-volume.pipe';
import { LoanStatusBadgePipe } from 'projects/public-search/src/app/pipe/loan-status-badge.pipe';
import { StatusBadgePipe } from 'projects/public-search/src/app/pipe/status-badge.pipe';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService): () => Observable<any> {
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
    ArrayTranslatePipe,
    PatronProfileDocumentComponent,
    PatronProfileHistoryComponent,
    PatronProfileMenuComponent,
    JournalVolumePipe,
    StatusBadgePipe,
    LoanStatusBadgePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    HttpClientXsrfModule,
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
    { provide: TranslateService, useClass: NgCoreTranslateService },
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true },
    { provide: CoreConfigService, useClass: AppConfigService }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule implements DoBootstrap {

  private injector: Injector = inject(Injector);

  ngDoBootstrap(): void {
    if (!customElements.get('public-patron-profile')) {
      const element = createCustomElement(PatronProfileComponent, { injector: this.injector });
      customElements.define('public-patron-profile', element);
    }
  }
}
