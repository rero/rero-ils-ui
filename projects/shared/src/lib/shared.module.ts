/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, Nl2brPipe, RecordModule } from '@rero/ng-core';
import { ContributionComponent } from '../public-api';
import { ActionButtonComponent } from './component/action-button/action-button.component';
import { BriefViewComponent } from './component/core/brief-view/brief-view.component';
import { DocumentBriefViewComponent } from './component/documents/document-brief-view/document-brief-view.component';
import { DescriptionZoneComponent } from './component/documents/document-description/description-zone/description-zone.component';
import { DocumentDescriptionComponent } from './component/documents/document-description/document-description.component';
import { OtherEditionComponent } from './component/documents/document-description/other-edition/other-edition.component';
import { FilesComponent } from './component/documents/files/files.component';
import { EntityBriefViewComponent } from './component/entities/entity-brief-view/entity-brief-view.component';
import { EntityBriefViewRemoteOrganisationComponent } from './component/entities/entity-brief-view/entity-brief-view.organisation';
import { EntityBriefViewRemotePersonComponent } from './component/entities/entity-brief-view/entity-brief-view.person';
import { OpenCloseButtonComponent } from './component/open-close-button.component';
import { OperationLogsDialogComponent } from './component/operation-logs/operation-logs-dialog/operation-logs-dialog.component';
import { OperationLogsComponent } from './component/operation-logs/operation-logs.component';
import { RemoteSearchComponent } from './component/remote-search/remote-search.component';
import { LinkPermissionsDirective } from './directive/link-permissions.directive';
import { PermissionsDirective } from './directive/permissions.directive';
import { ReroTemplateDirective } from './directive/rero-template.directive';
import { PrimeNgImportModule } from './modules/prime-ng-import/prime-ng-import.module';
import { ShowMorePagerComponent } from './paginator/show-more-pager/show-more-pager.component';
import { ArrayTranslatePipe } from './pipe/array-translate.pipe';
import { DocumentProvisionActivityPipe } from './pipe/document-provision-activity.pipe';
import { EntityLabelPipe } from './pipe/entity-label.pipe';
import { ExtractSourceFieldPipe } from './pipe/extract-source-field.pipe';
import { FaIconClassPipe } from './pipe/fa-icon-class.pipe';
import { GetTranslatedLabelPipe } from './pipe/get-translated-label.pipe';
import { IdAttributePipe } from './pipe/id-attribute.pipe';
import { IdentifiedByLabelPipe } from './pipe/identifiedby-label.pipe';
import { ItemHoldingsCallNumberPipe } from './pipe/item-holdings-call-number.pipe';
import { JoinPipe } from './pipe/join.pipe';
import { KeyExistsPipe } from './pipe/key-exists.pipe';
import { MainTitleRelationPipe } from './pipe/main-title-relation.pipe';
import { MainTitlePipe } from './pipe/main-title.pipe';
import { NotesFilterPipe } from './pipe/notes-filter.pipe';
import { PatronBlockedMessagePipe } from './pipe/patron-blocked-message.pipe';
import { ProvisionActivityPipe } from './pipe/provision-activity.pipe';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { UrlActivePipe } from './pipe/url-active.pipe';
import { AvailabilityComponent } from './view/availability/availability.component';
import { PartOfComponent } from './view/brief/part-of/part-of.component';
import { EntityLinkComponent } from './view/entity-link.component';
import { InheritedCallNumberComponent } from './view/inherited-call-number/inherited-call-number.component';
import { ThumbnailComponent } from './view/thumbnail/thumbnail.component';

@NgModule({
  declarations: [
    ActionButtonComponent,
    ArrayTranslatePipe,
    AvailabilityComponent,
    BriefViewComponent,
    ContributionComponent,
    DescriptionZoneComponent,
    DocumentBriefViewComponent,
    DocumentDescriptionComponent,
    DocumentProvisionActivityPipe,
    EntityBriefViewComponent,
    EntityBriefViewRemoteOrganisationComponent,
    EntityBriefViewRemotePersonComponent,
    EntityLabelPipe,
    EntityLinkComponent,
    ExtractSourceFieldPipe,
    FaIconClassPipe,
    FilesComponent,
    GetTranslatedLabelPipe,
    IdAttributePipe,
    IdentifiedByLabelPipe,
    InheritedCallNumberComponent,
    ItemHoldingsCallNumberPipe,
    JoinPipe,
    KeyExistsPipe,
    LinkPermissionsDirective,
    MainTitlePipe,
    MainTitleRelationPipe,
    NotesFilterPipe,
    OpenCloseButtonComponent,
    OtherEditionComponent,
    PartOfComponent,
    PatronBlockedMessagePipe,
    PermissionsDirective,
    ProvisionActivityPipe,
    RemoteSearchComponent,
    ReroTemplateDirective,
    SafeUrlPipe,
    ShowMorePagerComponent,
    ThumbnailComponent,
    UrlActivePipe,
    OperationLogsComponent,
    OperationLogsDialogComponent
  ],
  exports: [
    ActionButtonComponent,
    ArrayTranslatePipe,
    AvailabilityComponent,
    CommonModule,
    ContributionComponent,
    DocumentBriefViewComponent,
    DocumentDescriptionComponent,
    DocumentProvisionActivityPipe,
    EntityLabelPipe,
    EntityLinkComponent,
    ExtractSourceFieldPipe,
    FilesComponent,
    GetTranslatedLabelPipe,
    IdAttributePipe,
    InheritedCallNumberComponent,
    ItemHoldingsCallNumberPipe,
    JoinPipe,
    KeyExistsPipe,
    LinkPermissionsDirective,
    MainTitlePipe,
    MainTitleRelationPipe,
    Nl2brPipe,
    NotesFilterPipe,
    OpenCloseButtonComponent,
    OtherEditionComponent,
    PartOfComponent,
    PatronBlockedMessagePipe,
    PermissionsDirective,
    PrimeNgImportModule,
    ProvisionActivityPipe,
    ProvisionActivityPipe,
    RemoteSearchComponent,
    SafeUrlPipe,
    ShowMorePagerComponent,
    ThumbnailComponent,
    UrlActivePipe,
    OperationLogsComponent,
    OperationLogsDialogComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RecordModule,
    RouterModule,
    PrimeNgImportModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
