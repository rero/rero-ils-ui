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

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeysModule, HotkeysService } from '@ngneat/hotkeys';
import { FormlyModule } from '@ngx-formly/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  CoreConfigService, LocalStorageService, RecordModule, RemoteTypeaheadService,
  TranslateLoader, TranslateService, TruncateTextPipe
} from '@rero/ng-core';
import { ItemHoldingsCallNumberPipe, MainTitlePipe, SharedModule, UserService } from '@rero/shared';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {
  SelectAccountEditorWidgetComponent
} from './acquisition/components/editor/widget/select-account-editor-widget/select-account-editor-widget.component';
import { ReceivedOrderPermissionValidator } from './acquisition/utils/permissions';
import { CurrentLibraryPermissionValidator } from './utils/permissions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentsTypeahead } from './classes/typeahead/documents-typeahead';
import { ItemsTypeahead } from './classes/typeahead/items-typeahead';
import { MefOrganisationTypeahead } from './classes/typeahead/mef-organisation-typeahead';
import { MefPersonTypeahead } from './classes/typeahead/mef-person-typeahead';
import { MefTypeahead } from './classes/typeahead/mef-typeahead';
import { PatronsTypeahead } from './classes/typeahead/patrons-typeahead';
import { TabOrderDirective } from './directives/tab-order.directive';
import { ErrorPageComponent } from './error/error-page/error-page.component';
import { NoCacheHeaderInterceptor } from './interceptor/no-cache-header.interceptor';
import { MenuDashboardComponent } from './menu/menu-dashboard/menu-dashboard.component';
import { MenuLanguageComponent } from './menu/menu-language/menu-language.component';
import { MenuMobileComponent } from './menu/menu-mobile/menu-mobile.component';
import { SubMenuComponent } from './menu/menu-mobile/sub-menu/sub-menu.component';
import { MenuSwitchLibraryComponent } from './menu/menu-switch-library/menu-switch-library.component';
import { MenuUserServicesComponent } from './menu/menu-user-services/menu-user-services.component';
import { MenuUserComponent } from './menu/menu-user/menu-user.component';
import { MenuComponent } from './menu/menu.component';
import { LibrarySwitchService } from './menu/service/library-switch.service';
import { DocumentProvisionActivityPipe } from './pipe/document-provision-activity.pipe';
import { ItemInCollectionPipe } from './pipe/item-in-collection.pipe';
import { MainTitleRelationPipe } from './pipe/main-title-relation.pipe';
import { MarcPipe } from './pipe/marc.pipe';
import { NotesFormatPipe } from './pipe/notes-format.pipe';
import { SubjectProcessPipe } from './pipe/subject-process.pipe';
import { CircPoliciesBriefViewComponent } from './record/brief-view/circ-policies-brief-view.component';
import { CollectionBriefViewComponent } from './record/brief-view/collection-brief-view.component';
import { DocumentsBriefViewComponent } from './record/brief-view/documents-brief-view/documents-brief-view.component';
import { IllRequestsBriefViewComponent } from './record/brief-view/ill-requests-brief-view/ill-requests-brief-view.component';
import { IssuesBriefViewComponent } from './record/brief-view/issues-brief-view/issues-brief-view.component';
import { ItemTypesBriefViewComponent } from './record/brief-view/item-types-brief-view.component';
import { ItemsBriefViewComponent } from './record/brief-view/items-brief-view/items-brief-view.component';
import { LibrariesBriefViewComponent } from './record/brief-view/libraries-brief-view.component';
import { PatronTypesBriefViewComponent } from './record/brief-view/patron-types-brief-view.component';
import { PatronsBriefViewComponent } from './record/brief-view/patrons-brief-view/patrons-brief-view.component';
import { TemplatesBriefViewComponent } from './record/brief-view/templates-brief-view.component';
import { VendorBriefViewComponent } from './record/brief-view/vendor-brief-view.component';
import { CirculationLogComponent } from './record/circulation-logs/circulation-log/circulation-log.component';
import { CirculationLogsDialogComponent } from './record/circulation-logs/circulation-logs-dialog/circulation-logs-dialog.component';
import { CirculationLogsComponent } from './record/circulation-logs/circulation-logs.component';
import { DocumentEditorComponent } from './record/custom-editor/document-editor/document-editor.component';
import { HoldingEditorComponent } from './record/custom-editor/holding-editor/holding-editor.component';
import { ExceptionDatesEditComponent } from './record/custom-editor/libraries/exception-dates-edit/exception-dates-edit.component';
import { ExceptionDatesListComponent } from './record/custom-editor/libraries/exception-dates-list/exception-dates-list.component';
import { LibraryComponent } from './record/custom-editor/libraries/library.component';
import { NotificationTypePipe } from './record/custom-editor/libraries/pipe/notificationType.pipe';
import { UserIdEditorComponent } from './record/custom-editor/user-id-editor/user-id-editor.component';
import { AddressTypeComponent } from './record/detail-view/address-type/address-type.component';
import { CircPolicyDetailViewComponent } from './record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { CollectionDetailViewComponent } from './record/detail-view/collection-detail-view/collection-detail-view.component';
import { CollectionItemsComponent } from './record/detail-view/collection-detail-view/collection-items/collection-items.component';
import { ContributionDetailViewComponent } from './record/detail-view/contribution-detail-view/contribution-detail-view.component';
import {
  CorporateBodiesDetailViewComponent
} from './record/detail-view/contribution-detail-view/corporate-bodies-detail-view/corporate-bodies-detail-view.component';
import { PersonDetailViewComponent } from './record/detail-view/contribution-detail-view/person-detail-view/person-detail-view.component';
import { DialogImportComponent } from './record/detail-view/document-detail-view/dialog-import/dialog-import.component';
import { DescriptionZoneComponent } from './record/detail-view/document-detail-view/document-description/description-zone/description-zone.component';
import {
  DocumentDescriptionComponent
} from './record/detail-view/document-detail-view/document-description/document-description.component';
import {
  OtherEditionComponent
} from './record/detail-view/document-detail-view/document-description/other-edition/other-edition.component';
import { DocumentDetailViewComponent } from './record/detail-view/document-detail-view/document-detail-view.component';
import { HoldingDetailComponent } from './record/detail-view/document-detail-view/holding-detail/holding-detail.component';
import { HoldingSharedViewComponent } from './record/detail-view/document-detail-view/holding-shared-view/holding-shared-view.component';
import {
  DefaultHoldingItemComponent
} from './record/detail-view/document-detail-view/holding/default-holding-item/default-holding-item.component';
import { HoldingItemNoteComponent } from './record/detail-view/document-detail-view/holding/holding-item-note/holding-item-note.component';
import { HoldingItemTemporaryItemTypeComponent } from './record/detail-view/document-detail-view/holding/holding-item-temporary-item-type/holding-item-temporary-item-type.component';
import { HoldingComponent } from './record/detail-view/document-detail-view/holding/holding.component';
import {
  SerialHoldingItemComponent
} from './record/detail-view/document-detail-view/holding/serial-holding-item/serial-holding-item.component';
import { HoldingsComponent } from './record/detail-view/document-detail-view/holdings/holdings.component';
import { ItemRequestComponent } from './record/detail-view/document-detail-view/item-request/item-request.component';
import { RelatedResourceComponent } from './record/detail-view/document-detail-view/related-resource/related-resource.component';
import { HoldingDetailViewComponent } from './record/detail-view/holding-detail-view/holding-detail-view.component';
import {
  SerialHoldingDetailViewComponent
} from './record/detail-view/holding-detail-view/serial-holding-detail-view/serial-holding-detail-view.component';
import { IllRequestDetailViewComponent } from './record/detail-view/ill-request-detail-view/ill-request-detail-view.component';
import { ItemDetailViewComponent } from './record/detail-view/item-detail-view/item-detail-view.component';
import { ItemTransactionComponent } from './record/detail-view/item-detail-view/item-transaction/item-transaction.component';
import { ItemTransactionsComponent } from './record/detail-view/item-detail-view/item-transactions/item-transactions.component';
import { ItemTypeDetailViewComponent } from './record/detail-view/item-type-detail-view/item-type-detail-view.component';
import { DayOpeningHoursComponent } from './record/detail-view/library-detail-view/day-opening-hours/day-opening-hours.component';
import { ExceptionDateComponent } from './record/detail-view/library-detail-view/exception-date/exception-date.component';
import { LibraryDetailViewComponent } from './record/detail-view/library-detail-view/library-detail-view.component';
import { LocationComponent } from './record/detail-view/library-detail-view/location/location.component';
import { LocalFieldComponent } from './record/detail-view/local-field/local-field.component';
import { LocationDetailViewComponent } from './record/detail-view/location-detail-view/location-detail-view.component';
import { BudgetSelectLineComponent } from './record/detail-view/organisation-detail-view/budget-select-line/budget-select-line.component';
import { BudgetSelectComponent } from './record/detail-view/organisation-detail-view/budget-select/budget-select.component';
import { OrganisationDetailViewComponent } from './record/detail-view/organisation-detail-view/organisation-detail-view.component';
import { PatronDetailViewComponent } from './record/detail-view/patron-detail-view/patron-detail-view.component';
import { PatronTypesDetailViewComponent } from './record/detail-view/patron-types-detail-view/patron-types-detail-view.component';
import { RecordMaskedComponent } from './record/detail-view/record-masked/record-masked.component';
import { TemplateDetailViewComponent } from './record/detail-view/template-detail-view/template-detail-view.component';
import { VendorDetailViewComponent } from './record/detail-view/vendor-detail-view/vendor-detail-view.component';
import { DocumentRecordSearchComponent } from './record/document-record-search/document-record-search.component';
import { IdentifiedbyValueComponent } from './record/editor/wrappers/identifiedby-value.component';
import { UserIdComponent } from './record/editor/wrappers/user-id/user-id.component';
import { CipoPatronTypeItemTypeComponent } from './record/formly/type/cipo-patron-type-item-type/cipo-patron-type-item-type.component';
import { ItemAvailabilityComponent } from './record/item-availability/item-availability.component';
import { OperationLogsDialogComponent } from './record/operation-logs/operation-logs-dialog/operation-logs-dialog.component';
import { OperationLogsComponent } from './record/operation-logs/operation-logs.component';
import { AppConfigService } from './service/app-config.service';
import { OrganisationService } from './service/organisation.service';
import { TypeaheadFactoryService, typeaheadToken } from './service/typeahead-factory.service';
import { UiRemoteTypeaheadService } from './service/ui-remote-typeahead.service';
import { CustomShortcutHelpComponent } from './widgets/custom-shortcut-help/custom-shortcut-help.component';
import { FrontpageComponent } from './widgets/frontpage/frontpage.component';
import { CountryCodeTranslatePipe } from './pipe/country-code-translate.pipe';
import {
  HoldingOrganisationComponent
} from './record/detail-view/document-detail-view/holding-organisation/holding-organisation.component';
import { ItemAvailabilityPipe } from './pipe/item-availability.pipe';
import { ExpectedIssueComponent } from './record/detail-view/holding-detail-view/serial-holding-detail-view/expected-issue/expected-issue.component';
import { ReceivedIssueComponent } from './record/detail-view/holding-detail-view/serial-holding-detail-view/received-issue/received-issue.component';
import { AppInitializerService } from './service/app-initializer.service';

/** Init application factory */
export function appInitFactory(appInitializerService: AppInitializerService): () => Promise<any> {
  return () => appInitializerService.load().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    CircPoliciesBriefViewComponent,
    DocumentEditorComponent,
    DocumentsBriefViewComponent,
    ExceptionDatesEditComponent,
    ExceptionDatesListComponent,
    FrontpageComponent,
    ItemTypesBriefViewComponent,
    ItemTypeDetailViewComponent,
    LibrariesBriefViewComponent,
    LibraryComponent,
    MenuComponent,
    PatronsBriefViewComponent,
    PatronTypesBriefViewComponent,
    PatronTypesDetailViewComponent,
    LibraryDetailViewComponent,
    DayOpeningHoursComponent,
    ExceptionDateComponent,
    DocumentDetailViewComponent,
    HoldingEditorComponent,
    HoldingComponent,
    HoldingsComponent,
    LibraryComponent,
    ExceptionDatesListComponent,
    ExceptionDatesEditComponent,
    CircPolicyDetailViewComponent,
    ExceptionDateComponent,
    LocationDetailViewComponent,
    LocationComponent,
    ItemDetailViewComponent,
    ItemAvailabilityComponent,
    ItemTransactionComponent,
    ItemTransactionsComponent,
    ItemsBriefViewComponent,
    IssuesBriefViewComponent,
    PatronDetailViewComponent,
    VendorDetailViewComponent,
    VendorBriefViewComponent,
    AddressTypeComponent,
    OrganisationDetailViewComponent,
    BudgetSelectComponent,
    BudgetSelectLineComponent,
    RelatedResourceComponent,
    ItemRequestComponent,
    ErrorPageComponent,
    SerialHoldingItemComponent,
    SerialHoldingDetailViewComponent,
    HoldingDetailViewComponent,
    DefaultHoldingItemComponent,
    NotesFormatPipe,
    MarcPipe,
    TabOrderDirective,
    TemplatesBriefViewComponent,
    TemplateDetailViewComponent,
    CollectionBriefViewComponent,
    CollectionDetailViewComponent,
    CollectionItemsComponent,
    DocumentRecordSearchComponent,
    HoldingDetailComponent,
    ContributionDetailViewComponent,
    PersonDetailViewComponent,
    CorporateBodiesDetailViewComponent,
    IllRequestsBriefViewComponent,
    IllRequestDetailViewComponent,
    CustomShortcutHelpComponent,
    HoldingItemNoteComponent,
    MenuSwitchLibraryComponent,
    LocalFieldComponent,
    MenuUserServicesComponent,
    MenuLanguageComponent,
    MenuUserComponent,
    MenuDashboardComponent,
    MenuMobileComponent,
    SubMenuComponent,
    HoldingItemTemporaryItemTypeComponent,
    OperationLogsComponent,
    HoldingSharedViewComponent,
    OperationLogsDialogComponent,
    CipoPatronTypeItemTypeComponent,
    UserIdComponent,
    UserIdEditorComponent,
    RecordMaskedComponent,
    IdentifiedbyValueComponent,
    DialogImportComponent,
    SubjectProcessPipe,
    NotificationTypePipe,
    CirculationLogsComponent,
    CirculationLogsDialogComponent,
    CirculationLogComponent,
    ItemInCollectionPipe,
    CountryCodeTranslatePipe,
    DocumentDescriptionComponent,
    OtherEditionComponent,
    DescriptionZoneComponent,
    DocumentProvisionActivityPipe,
    MainTitleRelationPipe,
    HoldingOrganisationComponent,
    ItemAvailabilityPipe,
    ExpectedIssueComponent,
    ReceivedIssueComponent
  ],
  imports: [
    AppRoutingModule,
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecordModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    FormlyModule.forRoot({
      types: [
        { name: 'cipo-pt-it', component: CipoPatronTypeItemTypeComponent },
        { name: 'account-select', component: SelectAccountEditorWidgetComponent }
      ],
      wrappers: [
        { name: 'user-id', component: UserIdComponent },
        { name: 'identifiedby-value', component: IdentifiedbyValueComponent }
      ]
    }),
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
        deps: [CoreConfigService, HttpClient]
      }
    }),
    TypeaheadModule,
    HotkeysModule,
    SharedModule,
    LoadingBarHttpClientModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [
        AppInitializerService,
        UserService,
        AppConfigService,
        TranslateService,
        OrganisationService,
        LocalStorageService,
        LibrarySwitchService,
        TypeaheadFactoryService
      ],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheHeaderInterceptor,
      multi: true
    },
    { provide: RemoteTypeaheadService, useExisting: UiRemoteTypeaheadService },
    // Use the "multi" parameter to allow the recovery of several services in the injector.
    { provide: typeaheadToken, useExisting: DocumentsTypeahead, multi: true },
    { provide: typeaheadToken, useExisting: ItemsTypeahead, multi: true },
    { provide: typeaheadToken, useExisting: MefOrganisationTypeahead, multi: true },
    { provide: typeaheadToken, useExisting: MefPersonTypeahead, multi: true },
    { provide: typeaheadToken, useExisting: PatronsTypeahead, multi: true },
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
    MefTypeahead,
    DocumentsTypeahead,
    ItemsTypeahead,
    PatronsTypeahead,
    MainTitlePipe,
    MefPersonTypeahead,
    MefOrganisationTypeahead,
    TruncateTextPipe,
    CurrentLibraryPermissionValidator,
    ReceivedOrderPermissionValidator,
    // TODO: needed for production build, remove this after it is fixed in the
    // @ngneat/hotkeys library
    {
      provide: HotkeysService,
      useClass: HotkeysService
    },
    MainTitlePipe,
    ItemHoldingsCallNumberPipe
  ],
  entryComponents: [
    IllRequestsBriefViewComponent,
    IllRequestDetailViewComponent,
    CircPoliciesBriefViewComponent,
    DocumentEditorComponent,
    HoldingEditorComponent,
    DocumentsBriefViewComponent,
    ExceptionDatesEditComponent,
    ItemTypesBriefViewComponent,
    ItemTypeDetailViewComponent,
    ItemsBriefViewComponent,
    IssuesBriefViewComponent,
    LibrariesBriefViewComponent,
    PatronsBriefViewComponent,
    PatronTypesDetailViewComponent,
    PatronTypesBriefViewComponent,
    ExceptionDatesEditComponent,
    LibraryDetailViewComponent,
    LibraryComponent,
    DocumentDetailViewComponent,
    ExceptionDatesEditComponent,
    CircPolicyDetailViewComponent,
    LocationDetailViewComponent,
    ItemDetailViewComponent,
    PatronDetailViewComponent,
    VendorDetailViewComponent,
    VendorBriefViewComponent,
    OrganisationDetailViewComponent,
    ItemRequestComponent,
    ErrorPageComponent,
    HoldingDetailViewComponent,
    TemplatesBriefViewComponent,
    TemplateDetailViewComponent,
    CollectionBriefViewComponent,
    CollectionDetailViewComponent,
    DocumentRecordSearchComponent,
    CustomShortcutHelpComponent,
    ContributionDetailViewComponent,
    OperationLogsComponent,
    UserIdEditorComponent,
    HoldingOrganisationComponent
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
