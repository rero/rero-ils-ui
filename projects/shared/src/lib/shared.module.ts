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

import { CommonModule, DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule, NgVarDirective, Nl2brPipe, RecordModule, TruncateTextPipe } from '@rero/ng-core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ContributionComponent } from '../public-api';
import { ActionButtonComponent } from './component/action-button/action-button.component';
import { BriefViewComponent } from './component/core/brief-view/brief-view.component';
import { DocumentBriefViewComponent } from './component/documents/document-brief-view/document-brief-view.component';
import { FilesComponent } from './component/documents/files/files.component';
import { EntityBriefViewComponent } from './component/entities/entity-brief-view/entity-brief-view.component';
import { EntityBriefViewRemoteOrganisationComponent } from './component/entities/entity-brief-view/entity-brief-view.organisation';
import { EntityBriefViewRemotePersonComponent } from './component/entities/entity-brief-view/entity-brief-view.person';
import { RemoteSearchComponent } from './component/remote-search/remote-search.component';
import { LinkPermissionsDirective } from './directive/link-permissions.directive';
import { NoContentDirective } from './directive/no-content.directive';
import { PermissionsDirective } from './directive/permissions.directive';
import { ReroTemplateDirective } from './directive/rero-template.directive';
import { PrimeNgImportModule } from './modules/prime-ng-import/prime-ng-import.module';
import { ShowMorePagerComponent } from './paginator/show-more-pager/show-more-pager.component';
import { EntityLabelPipe } from './pipe/entity-label.pipe';
import { ExtractSourceFieldPipe } from './pipe/extract-source-field.pipe';
import { FaIconClassPipe } from './pipe/fa-icon-class.pipe';
import { GetTranslatedLabelPipe } from './pipe/get-translated-label.pipe';
import { IdAttributePipe } from './pipe/id-attribute.pipe';
import { IdentifiedByLabelPipe } from './pipe/identifiedby-label.pipe';
import { IsArrayPipe } from './pipe/is-array.pipe';
import { ItemHoldingsCallNumberPipe } from './pipe/item-holdings-call-number.pipe';
import { JoinPipe } from './pipe/join.pipe';
import { KeyExistsPipe } from './pipe/key-exists.pipe';
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
    ExtractSourceFieldPipe,
    IdAttributePipe,
    JoinPipe,
    MainTitlePipe,
    PatronBlockedMessagePipe,
    ProvisionActivityPipe,
    UrlActivePipe,
    FaIconClassPipe,
    ItemHoldingsCallNumberPipe,
    InheritedCallNumberComponent,
    ThumbnailComponent,
    PartOfComponent,
    ShowMorePagerComponent,
    KeyExistsPipe,
    GetTranslatedLabelPipe,
    ActionButtonComponent,
    NotesFilterPipe,
    SafeUrlPipe,
    PermissionsDirective,
    LinkPermissionsDirective,
    EntityLabelPipe,
    NoContentDirective,
    EntityBriefViewComponent,
    BriefViewComponent,
    ReroTemplateDirective,
    IsArrayPipe,
    EntityBriefViewRemoteOrganisationComponent,
    EntityBriefViewRemotePersonComponent,
    ContributionComponent,
    NoContentDirective,
    AvailabilityComponent,
    EntityLinkComponent,
    DocumentBriefViewComponent,
    IdentifiedByLabelPipe,
    FilesComponent,
    RemoteSearchComponent
  ],
  exports: [
    CommonModule,
    PrimeNgImportModule,
    ExtractSourceFieldPipe,
    IdAttributePipe,
    JoinPipe,
    MainTitlePipe,
    PatronBlockedMessagePipe,
    ProvisionActivityPipe,
    UrlActivePipe,
    Nl2brPipe,
    ItemHoldingsCallNumberPipe,
    InheritedCallNumberComponent,
    ThumbnailComponent,
    PartOfComponent,
    ShowMorePagerComponent,
    KeyExistsPipe,
    GetTranslatedLabelPipe,
    ActionButtonComponent,
    NotesFilterPipe,
    SafeUrlPipe,
    PermissionsDirective,
    LinkPermissionsDirective,
    EntityLabelPipe,
    NoContentDirective,
    ContributionComponent,
    NoContentDirective,
    AvailabilityComponent,
    EntityLinkComponent,
    DocumentBriefViewComponent,
    FilesComponent,
    RemoteSearchComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RecordModule,
    RouterModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    PrimeNgImportModule
  ],
  providers: [
    DatePipe,
    MainTitlePipe,
    JoinPipe,
    UrlActivePipe,
    TruncateTextPipe,
    Nl2brPipe,
    NgVarDirective,
    KeyExistsPipe,
    NotesFilterPipe,
    EntityLabelPipe,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
