/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule, TruncateTextPipe } from '@rero/ng-core';
import { NgVarDirective } from './directive/ng-var.directive';
import { ContributionFormatPipe } from './pipe/contribution-format.pipe';
import { ContributionTypePipe } from './pipe/contribution-type.pipe';
import { ExtractSourceFieldPipe } from './pipe/extract-source-field.pipe';
import { IdAttributePipe } from './pipe/id-attribute.pipe';
import { MainTitlePipe } from './pipe/main-title.pipe';
import { PatronBlockedMessagePipe } from './pipe/patron-blocked-message.pipe';
import { ProvisionActivityPipe } from './pipe/provision-activity.pipe';
import { UrlActivePipe } from './pipe/url-active.pipe';
import { SearchBarConfigService } from './service/search-bar-config.service';
import { SharedConfigService } from './service/shared-config.service';
import { ContributionBriefComponent } from './view/brief/contribution-brief/contribution-brief.component';
import { ContributionSourcesComponent } from './view/brief/contribution-sources/contribution-sources.component';
import { OrganisationBriefComponent } from './view/brief/organisation-brief/organisation-brief.component';
import { PersonBriefComponent } from './view/brief/person-brief/person-brief.component';
import { ThumbnailComponent } from './view/thumbnail/thumbnail.component';

@NgModule({
  declarations: [
    ContributionBriefComponent,
    ContributionSourcesComponent,
    OrganisationBriefComponent,
    PersonBriefComponent,
    ContributionFormatPipe,
    ExtractSourceFieldPipe,
    IdAttributePipe,
    MainTitlePipe,
    PatronBlockedMessagePipe,
    ProvisionActivityPipe,
    ContributionTypePipe,
    UrlActivePipe,
    NgVarDirective,
    ThumbnailComponent
  ],
  exports: [
    CommonModule,
    ContributionBriefComponent,
    ContributionSourcesComponent,
    OrganisationBriefComponent,
    PersonBriefComponent,
    ContributionFormatPipe,
    ExtractSourceFieldPipe,
    IdAttributePipe,
    MainTitlePipe,
    PatronBlockedMessagePipe,
    ProvisionActivityPipe,
    ContributionTypePipe,
    UrlActivePipe,
    NgVarDirective,
    ThumbnailComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ],
  providers: [
    SharedConfigService,
    SearchBarConfigService,
    DatePipe,
    MainTitlePipe,
    ContributionTypePipe,
    UrlActivePipe,
    TruncateTextPipe
  ],
  entryComponents: [
    ContributionBriefComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule {}
