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

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, RecordModule, TranslateService } from '@rero/ng-core';
import { BsDatepickerModule, BsLocaleService, CollapseModule, TabsModule, TooltipModule, TypeaheadModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { FrontpageBoardComponent } from './frontpage/frontpage-board/frontpage-board.component';
import { NoCacheHeaderInterceptor } from './interceptor/no-cache-header.interceptor';
import { InterfaceInfoComponent } from './interface-info/interface-info.component';
import { MenuComponent } from './menu/menu.component';
import { AuthorNameTranslatePipe } from './pipe/author-name-translate.pipe';
import { BioInformationsPipe } from './pipe/bio-informations.pipe';
import { BirthDatePipe } from './pipe/birth-date.pipe';
import { MefTitlePipe } from './pipe/mef-title.pipe';
import { AcquisitionOrderBriefViewComponent } from './record/brief-view/acquisition-order-brief-view.component';
import { BudgetsBriefViewComponent } from './record/brief-view/budgets-brief-view.component';
import { CircPoliciesBriefViewComponent } from './record/brief-view/circ-policies-brief-view.component';
import { DocumentsBriefViewComponent } from './record/brief-view/documents-brief-view/documents-brief-view.component';
import { ItemTypesBriefViewComponent } from './record/brief-view/item-types-brief-view.component';
import { LibrariesBriefViewComponent } from './record/brief-view/libraries-brief-view/libraries-brief-view.component';
import { LocationComponent } from './record/brief-view/libraries-brief-view/location/location.component';
import { PatronTypesBriefViewComponent } from './record/brief-view/patron-types-brief-view.component';
import { PatronsBriefViewComponent } from './record/brief-view/patrons-brief-view.component';
import { PersonsBriefViewComponent } from './record/brief-view/persons-brief-view.component';
import { VendorBriefViewComponent } from './record/brief-view/vendor-brief-view.component';
import { CirculationPolicyComponent } from './record/custom-editor/circulation-settings/circulation-policy/circulation-policy.component';
import { DocumentEditorComponent } from './record/custom-editor/document-editor/document-editor.component';
import { ExceptionDatesEditComponent } from './record/custom-editor/libraries/exception-dates-edit/exception-dates-edit.component';
import { ExceptionDatesListComponent } from './record/custom-editor/libraries/exception-dates-list/exception-dates-list.component';
import { LibraryComponent } from './record/custom-editor/libraries/library.component';
import {
  AcquisitionOrderDetailViewComponent
} from './record/detail-view/acquisition-order-detail-view/acquisition-order-detail-view.component';
import {
  AcquisitionOrderLinesComponent
} from './record/detail-view/acquisition-order-detail-view/order-lines/acquisition-order-lines.component';
import {
  AcquisitionOrderLineDetailViewComponent
} from './record/detail-view/acquisition-order-line-detail-view/acquisition-order-line-detail-view.component';
import { AddressTypeComponent } from './record/detail-view/address-type/address-type.component';
import { AcquisitionAccountComponent } from './record/detail-view/budget-detail-view/acquisition-account/acquisition-account.component';
import { AcquisitionAccountsComponent } from './record/detail-view/budget-detail-view/acquisition-accounts/acquisition-accounts.component';
import { BudgetDetailViewComponent } from './record/detail-view/budget-detail-view/budget-detail-view.component';
import { CircPolicyDetailViewComponent } from './record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { DocumentDetailViewComponent } from './record/detail-view/document-detail-view/document-detail-view.component';
import { HoldingItemComponent } from './record/detail-view/document-detail-view/holding-item/holding-item.component';
import { HoldingComponent } from './record/detail-view/document-detail-view/holding/holding.component';
import { HoldingsComponent } from './record/detail-view/document-detail-view/holdings/holdings.component';
import { ItemDetailViewComponent } from './record/detail-view/item-detail-view/item-detail-view.component';
import { ItemTransactionComponent } from './record/detail-view/item-detail-view/item-transaction/item-transaction.component';
import { ItemTransactionsComponent } from './record/detail-view/item-detail-view/item-transactions/item-transactions.component';
import { ItemTypeDetailViewComponent } from './record/detail-view/item-type-detail-view.component';
import { DayOpeningHoursComponent } from './record/detail-view/library-detail-view/day-opening-hours/day-opening-hours.component';
import { ExceptionDateComponent } from './record/detail-view/library-detail-view/exception-date/exception-date.component';
import { LibraryDetailViewComponent } from './record/detail-view/library-detail-view/library-detail-view.component';
import { LocationDetailViewComponent } from './record/detail-view/location-detail-view/location-detail-view.component';
import { BudgetSelectLineComponent } from './record/detail-view/organisation-detail-view/budget-select-line/budget-select-line.component';
import { BudgetSelectComponent } from './record/detail-view/organisation-detail-view/budget-select/budget-select.component';
import { OrganisationDetailViewComponent } from './record/detail-view/organisation-detail-view/organisation-detail-view.component';
import { PatronDetailViewComponent } from './record/detail-view/patron-detail-view/patron-detail-view.component';
import { PatronTypesDetailViewComponent } from './record/detail-view/patron-types-detail-view.component';
import { PersonDetailViewComponent } from './record/detail-view/person-detail-view/person-detail-view.component';
import { VendorDetailViewComponent } from './record/detail-view/vendor-detail-view/vendor-detail-view.component';
import { RefComponent } from './record/editor/ref/ref.component';
import { RemoteAutocompleteInputTypeComponent } from './record/editor/remote-autocomplete/remote-autocomplete.component';
import { ItemAvailabilityComponent } from './record/item-availability/item-availability.component';
import { AppConfigService } from './service/app-config.service';
import { TranslateLoader } from './translate/loader/translate-loader';

@NgModule({
  declarations: [
    AppComponent,
    BioInformationsPipe,
    BirthDatePipe,
    CircPoliciesBriefViewComponent,
    CirculationPolicyComponent,
    DocumentEditorComponent,
    DocumentsBriefViewComponent,
    ExceptionDatesEditComponent,
    ExceptionDatesListComponent,
    FrontpageComponent,
    ItemTypesBriefViewComponent,
    ItemTypeDetailViewComponent,
    LibrariesBriefViewComponent,
    LibraryComponent,
    MefTitlePipe,
    MenuComponent,
    PatronsBriefViewComponent,
    PatronTypesBriefViewComponent,
    PatronTypesDetailViewComponent,
    PersonsBriefViewComponent,
    LibraryDetailViewComponent,
    DayOpeningHoursComponent,
    ExceptionDateComponent,
    PersonDetailViewComponent,
    DocumentDetailViewComponent,
    HoldingComponent,
    HoldingItemComponent,
    HoldingsComponent,
    BioInformationsPipe,
    BirthDatePipe,
    MefTitlePipe,
    LibraryComponent,
    ExceptionDatesListComponent,
    ExceptionDatesEditComponent,
    CirculationPolicyComponent,
    CircPolicyDetailViewComponent,
    ExceptionDateComponent,
    LocationDetailViewComponent,
    LocationComponent,
    ItemDetailViewComponent,
    ItemAvailabilityComponent,
    ItemTransactionComponent,
    ItemTransactionsComponent,
    AuthorNameTranslatePipe,
    PatronDetailViewComponent,
    InterfaceInfoComponent,
    RefComponent,
    RemoteAutocompleteInputTypeComponent,
    InterfaceInfoComponent,
    VendorDetailViewComponent,
    VendorBriefViewComponent,
    AddressTypeComponent,
    AcquisitionOrderDetailViewComponent,
    AcquisitionOrderBriefViewComponent,
    AcquisitionOrderLineDetailViewComponent,
    AcquisitionOrderLinesComponent,
    BudgetsBriefViewComponent,
    BudgetDetailViewComponent,
    AcquisitionAccountsComponent,
    AcquisitionAccountComponent,
    OrganisationDetailViewComponent,
    BudgetSelectComponent,
    BudgetSelectLineComponent,
    FrontpageBoardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecordModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FormlyModule.forRoot({
      wrappers: [{ name: 'ref', component: RefComponent }],
      types: [
        {
          name: 'remoteautocomplete',
          component: RemoteAutocompleteInputTypeComponent
        }
      ]
    }),
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader
      }
    }),
    TypeaheadModule,
    UiSwitchModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheHeaderInterceptor,
      multi: true
    },
    {
      provide: CoreConfigService,
      useClass: AppConfigService
    },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.currentLanguage,
      deps: [TranslateService]
    },
    BsLocaleService
  ],
  entryComponents: [
    CircPoliciesBriefViewComponent,
    CirculationPolicyComponent,
    DocumentEditorComponent,
    DocumentsBriefViewComponent,
    ExceptionDatesEditComponent,
    ItemTypesBriefViewComponent,
    ItemTypeDetailViewComponent,
    LibrariesBriefViewComponent,
    PatronsBriefViewComponent,
    PatronTypesDetailViewComponent,
    PatronTypesBriefViewComponent,
    PersonsBriefViewComponent,
    ExceptionDatesEditComponent,
    LibraryDetailViewComponent,
    LibraryComponent,
    LibraryComponent,
    PersonDetailViewComponent,
    DocumentDetailViewComponent,
    ExceptionDatesEditComponent,
    CircPolicyDetailViewComponent,
    CirculationPolicyComponent,
    LibraryComponent,
    LocationDetailViewComponent,
    ItemDetailViewComponent,
    PatronDetailViewComponent,
    RefComponent,
    RemoteAutocompleteInputTypeComponent,
    VendorDetailViewComponent,
    VendorBriefViewComponent,
    AcquisitionOrderDetailViewComponent,
    AcquisitionOrderBriefViewComponent,
    AcquisitionOrderLineDetailViewComponent,
    BudgetsBriefViewComponent,
    BudgetDetailViewComponent,
    OrganisationDetailViewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
