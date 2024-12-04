/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { NgModule } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';

import { RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';
import { InplaceModule } from 'primeng/inplace';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MigrationDataBriefComponent } from './conversion/record/brief-view/migration-data/migration-data.component';
import { MigrationDataDetailComponent } from './conversion/record/detail-view/migration-data/migration-data.component';
import { HighlightJsonPipe } from './conversion/record/detail-view/pipes/highlight-json.pipe';
import { MigrationDataDeduplicationBriefComponent } from './deduplication/record/brief-view/migration-data-deduplication/migration-data-deduplication.component';
import { MigrationMetadataBriefComponent } from './deduplication/record/brief-view/migration-metadata/migration-metadata.component';
import { MigrationSearchPageComponent } from './deduplication/record/search/migration-search-page.component';
import { MigrationSearchComponent } from './deduplication/record/search/migration-search/migration-search.component';
import { MigrationRoutingModule } from './migration-routing.module';
import { MigrationDetailComponent } from './record/brief-view/migration/migration.component';

@NgModule({
  declarations: [
    MigrationDetailComponent,
    MigrationDataBriefComponent,
    MigrationDataDetailComponent,
    HighlightJsonPipe,
    MigrationDataDeduplicationBriefComponent,
    MigrationMetadataBriefComponent,
    MigrationSearchPageComponent,
    MigrationSearchComponent,
  ],
  imports: [
    MigrationRoutingModule,
    BadgeModule,
    SharedModule,
    RecordModule,
    MessagesModule,
    TableModule,
    InplaceModule,
    ToastModule,
    DataViewModule,
    AutoFocusModule
  ],
  exports: [],
  providers: [MessageService],
})
export class MigrationModule {}
