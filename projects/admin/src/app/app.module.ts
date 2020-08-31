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
import { CoreConfigService, RecordModule, TranslateLoader, TranslateService } from '@rero/ng-core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './error/error-page/error-page.component';
import { FrontpageBoardComponent } from './widgets/frontpage/frontpage-board/frontpage-board.component';
import { FrontpageComponent } from './widgets/frontpage/frontpage.component';
import { NoCacheHeaderInterceptor } from './interceptor/no-cache-header.interceptor';
import { MenuComponent } from './menu/menu.component';
import { BioInformationsPipe } from './pipe/bio-informations.pipe';
import { BirthDatePipe } from './pipe/birth-date.pipe';
import { MefTitlePipe } from './pipe/mef-title.pipe';
import { NotesFormatPipe } from './pipe/notes-format.pipe';
import { AcquisitionOrderBriefViewComponent } from './record/brief-view/acquisition-order-brief-view.component';
import { BudgetsBriefViewComponent } from './record/brief-view/budgets-brief-view.component';
import { CircPoliciesBriefViewComponent } from './record/brief-view/circ-policies-brief-view.component';
import { DocumentsBriefViewComponent } from './record/brief-view/documents-brief-view/documents-brief-view.component';
import { ItemTypesBriefViewComponent } from './record/brief-view/item-types-brief-view.component';
import { LibrariesBriefViewComponent } from './record/brief-view/libraries-brief-view.component';
import { PatronTypesBriefViewComponent } from './record/brief-view/patron-types-brief-view.component';
import { PatronsBriefViewComponent } from './record/brief-view/patrons-brief-view.component';
import { PersonsBriefViewComponent } from './record/brief-view/persons-brief-view.component';
import { VendorBriefViewComponent } from './record/brief-view/vendor-brief-view.component';
import { CirculationPolicyComponent } from './record/custom-editor/circulation-settings/circulation-policy/circulation-policy.component';
import { DocumentEditorComponent } from './record/custom-editor/document-editor/document-editor.component';
import { HoldingEditorComponent } from './record/custom-editor/holding-editor/holding-editor.component';
import { ExceptionDatesEditComponent } from './record/custom-editor/libraries/exception-dates-edit/exception-dates-edit.component';
import { ExceptionDatesListComponent } from './record/custom-editor/libraries/exception-dates-list/exception-dates-list.component';
import { LibraryComponent } from './record/custom-editor/libraries/library.component';
import {
  AcquisitionOrderDetailViewComponent
} from './record/detail-view/acquisition-order-detail-view/acquisition-order-detail-view.component';
import {
  AcquisitionOrderLinesComponent
} from './record/detail-view/acquisition-order-detail-view/order-lines/acquisition-order-lines.component';
import { OrderLineComponent } from './record/detail-view/acquisition-order-detail-view/order-lines/order-line/order-line.component';
import {
  AcquisitionOrderLineDetailViewComponent
} from './record/detail-view/acquisition-order-line-detail-view/acquisition-order-line-detail-view.component';
import { AddressTypeComponent } from './record/detail-view/address-type/address-type.component';
import { AcquisitionAccountComponent } from './record/detail-view/budget-detail-view/acquisition-account/acquisition-account.component';
import { AcquisitionAccountsComponent } from './record/detail-view/budget-detail-view/acquisition-accounts/acquisition-accounts.component';
import { BudgetDetailViewComponent } from './record/detail-view/budget-detail-view/budget-detail-view.component';
import { CircPolicyDetailViewComponent } from './record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { DocumentDetailViewComponent } from './record/detail-view/document-detail-view/document-detail-view.component';
import {
  DefaultHoldingItemComponent
} from './record/detail-view/document-detail-view/holding/default-holding-item/default-holding-item.component';
import { HoldingComponent } from './record/detail-view/document-detail-view/holding/holding.component';
import {
  SerialHoldingItemComponent
} from './record/detail-view/document-detail-view/holding/serial-holding-item/serial-holding-item.component';
import { HoldingsComponent } from './record/detail-view/document-detail-view/holdings/holdings.component';
import { ItemRequestComponent } from './record/detail-view/document-detail-view/item-request/item-request.component';
import { RelatedResourceComponent } from './record/detail-view/document-detail-view/related-resource/related-resource.component';
import { ResourceComponent } from './record/detail-view/document-detail-view/resource/resource.component';
import { HoldingDetailViewComponent } from './record/detail-view/holding-detail-view/holding-detail-view.component';
import {
  SerialHoldingDetailViewComponent
} from './record/detail-view/holding-detail-view/serial-holding-detail-view/serial-holding-detail-view.component';
import { ItemDetailViewComponent } from './record/detail-view/item-detail-view/item-detail-view.component';
import { ItemTransactionComponent } from './record/detail-view/item-detail-view/item-transaction/item-transaction.component';
import { ItemTransactionsComponent } from './record/detail-view/item-detail-view/item-transactions/item-transactions.component';
import { ItemTypeDetailViewComponent } from './record/detail-view/item-type-detail-view.component';
import { DayOpeningHoursComponent } from './record/detail-view/library-detail-view/day-opening-hours/day-opening-hours.component';
import { ExceptionDateComponent } from './record/detail-view/library-detail-view/exception-date/exception-date.component';
import { LibraryDetailViewComponent } from './record/detail-view/library-detail-view/library-detail-view.component';
import { LocationComponent } from './record/detail-view/library-detail-view/location/location.component';
import { LocationDetailViewComponent } from './record/detail-view/location-detail-view/location-detail-view.component';
import { BudgetSelectLineComponent } from './record/detail-view/organisation-detail-view/budget-select-line/budget-select-line.component';
import { BudgetSelectComponent } from './record/detail-view/organisation-detail-view/budget-select/budget-select.component';
import { OrganisationDetailViewComponent } from './record/detail-view/organisation-detail-view/organisation-detail-view.component';
import { PatronDetailViewComponent } from './record/detail-view/patron-detail-view/patron-detail-view.component';
import { PatronTypesDetailViewComponent } from './record/detail-view/patron-types-detail-view/patron-types-detail-view.component';
import { PersonDetailViewComponent } from './record/detail-view/person-detail-view/person-detail-view.component';
import { VendorDetailViewComponent } from './record/detail-view/vendor-detail-view/vendor-detail-view.component';
import { ItemAvailabilityComponent } from './record/item-availability/item-availability.component';
import { AppConfigService } from './service/app-config.service';
import { SharedPipesModule } from './shared/shared-pipes.module';
import { MarcPipe } from './pipe/marc.pipe';
import { TabOrderDirective } from './directives/tab-order.directive';
import { ItemsBriefViewComponent } from './record/brief-view/items-brief-view/items-brief-view.component';
import { UiRemoteTypeaheadService } from './service/ui-remote-typeahead.service';
import { RemoteTypeaheadService } from '@rero/ng-core';
import { MefTypeahead } from './class/mef-typeahead';
import { TemplatesBriefViewComponent } from './record/brief-view/templates-brief-view.component';
import { TemplateDetailViewComponent } from './record/detail-view/template-detail-view/template-detail-view.component';

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
    HoldingEditorComponent,
    HoldingComponent,
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
    ItemsBriefViewComponent,
    PatronDetailViewComponent,
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
    FrontpageBoardComponent,
    RelatedResourceComponent,
    ResourceComponent,
    ItemRequestComponent,
    ErrorPageComponent,
    OrderLineComponent,
    SerialHoldingItemComponent,
    SerialHoldingDetailViewComponent,
    HoldingDetailViewComponent,
    DefaultHoldingItemComponent,
    NotesFormatPipe,
    MarcPipe,
    TabOrderDirective,
    TemplatesBriefViewComponent,
    TemplateDetailViewComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecordModule,
    SharedPipesModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    FormlyModule.forRoot({}),
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
      provide: RemoteTypeaheadService,
      useClass: UiRemoteTypeaheadService
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
    BsLocaleService,
    MefTypeahead
  ],
  entryComponents: [
    CircPoliciesBriefViewComponent,
    CirculationPolicyComponent,
    DocumentEditorComponent,
    HoldingEditorComponent,
    DocumentsBriefViewComponent,
    ExceptionDatesEditComponent,
    ItemTypesBriefViewComponent,
    ItemTypeDetailViewComponent,
    ItemsBriefViewComponent,
    LibrariesBriefViewComponent,
    PatronsBriefViewComponent,
    PatronTypesDetailViewComponent,
    PatronTypesBriefViewComponent,
    PersonsBriefViewComponent,
    ExceptionDatesEditComponent,
    LibraryDetailViewComponent,
    LibraryComponent,
    PersonDetailViewComponent,
    DocumentDetailViewComponent,
    ExceptionDatesEditComponent,
    CircPolicyDetailViewComponent,
    CirculationPolicyComponent,
    LocationDetailViewComponent,
    ItemDetailViewComponent,
    PatronDetailViewComponent,
    VendorDetailViewComponent,
    VendorBriefViewComponent,
    AcquisitionOrderDetailViewComponent,
    AcquisitionOrderBriefViewComponent,
    AcquisitionOrderLineDetailViewComponent,
    BudgetsBriefViewComponent,
    BudgetDetailViewComponent,
    OrganisationDetailViewComponent,
    ItemRequestComponent,
    ErrorPageComponent,
    HoldingDetailViewComponent,
    TemplatesBriefViewComponent,
    TemplateDetailViewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
