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
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { _ } from "@ngx-translate/core";
import { RecordSearchPageComponent } from '@rero/ng-core';
import { of } from 'rxjs';
import { MigrationDataBriefComponent as ConversionMigrationDataComponent } from './conversion/record/brief-view/migration-data/migration-data.component';
import { MigrationDetailComponent } from './record/brief-view/migration/migration.component';

import { MigrationDataDetailComponent } from './conversion/record/detail-view/migration-data/migration-data.component';
import { MigrationDataDeduplicationBriefComponent } from './deduplication/record/brief-view/migration-data-deduplication/migration-data-deduplication.component';
import { MigrationSearchPageComponent } from './deduplication/record/search/migration-search-page.component';

const routes: Routes = [
  {
    matcher: (url) => {
      if (url.length == 2 && url[0].path === 'records' && url[1].path === 'migrations') {
        return {
          consumed: url,
          posParams: { type: new UrlSegment(url[1].path, {}) },
        };
      }
      return null;
    },
    data: {
      types: [
        {
          key: 'migrations',
          label: _('Migrations'),
          component: MigrationDetailComponent,
          canDelete: (record: any) => of(false),
          canAdd: (record: any) => of(false),
          canUpdate: (record: any) => of(false),
          aggregationsExpand: ['status'],
          aggregationsOrder: ['status'],
          aggregationsBucketSize: 10,
        },
      ],
    },
    children: [
      {
        path: '',
        component: RecordSearchPageComponent,
      },
    ],
  },
  {
    matcher: (url) => {
      if (url[0].path === 'records' && url[1].path === 'format' && url[2].path === 'migration_data') {
        const segments = [
          new UrlSegment(url[0].path, {}),
          new UrlSegment(url[1].path, {}),
          new UrlSegment(url[2].path, {}),
        ];
        return {
          consumed: segments,
          posParams: { type: new UrlSegment(url[2].path, {}) },
        };
      }
      return null;
    },
    data: {
      types: [
        {
          key: 'migration_data',
          label: _('Migrations Data Conversion'),
          component: ConversionMigrationDataComponent,
          canDelete: (record: any) => of(false),
          canAdd: (record: any) => of(false),
          canUpdate: (record: any) => of(false),
          aggregationsExpand: ['migration', 'conversion_status'],
          aggregationsOrder: ['migration', 'conversion_status'],
          aggregationsBucketSize: 10,
          sortOptions: [
            {
              label: _('Relevance'),
              value: '_score',
              icon: 'fa fa-sort-amount-desc',
              defaultQuery: true,
            },
            {
              label: _('Modification date (newest)'),
              value: '-updated_at',
              icon: 'fa fa-sort-amount-desc'
            },
            {
              label: _('Modification date (oldest)'),
              value: 'updated_at',
              icon: 'fa fa-sort-amount-asc',
            },
            {
              label: _('Identifier'),
              value: '-_id',
              icon: 'fa fa-sort-alpha-asc'
            },
          ],
        },
      ],
    },
    children: [
      {
        path: '',
        component: RecordSearchPageComponent,
      },
      {
        path: 'detail/:pid',
        component: MigrationDataDetailComponent,
      },
    ],
  },
  {
    matcher: (url) => {
      if (url[0].path === 'records' && url[1].path === 'deduplication' && url[2].path === 'migration_data') {
        const segments = [
          new UrlSegment(url[0].path, {}),
          new UrlSegment(url[1].path, {}),
          new UrlSegment(url[2].path, {}),
        ];
        return {
          consumed: segments,
          posParams: { type: new UrlSegment(url[2].path, {}) },
        };
      }
      return null;
    },
    data: {
      types: [
        {
          key: 'migration_data',
          label: _('Migrations Data Deduplication'),
          component: MigrationDataDeduplicationBriefComponent,
          canDelete: (record: any) => of(false),
          canAdd: (record: any) => of(false),
          canUpdate: (record: any) => of(false),
          aggregationsOrder: ['migration', 'deduplication_status', 'batch', 'modified_by'],
          aggregationsExpand: ['migration', 'deduplication_status', 'batch', 'modified_by'],
          aggregationsBucketSize: 10,
          sortOptions: [
            {
              label: _('Relevance'),
              value: '_score',
              icon: 'fa fa-sort-amount-desc',
              defaultQuery: true,
            },
            {
              label: _('Modification date (newest)'),
              value: '-updated_at',
              icon: 'fa fa-sort-amount-desc'
            },
            {
              label: _('Modification date (oldest)'),
              value: 'updated_at',
              icon: 'fa fa-sort-amount-asc',
            },
            {
              label: _('Score'),
              value: '-deduplication.candidates.score',
              icon: 'fa fa-sort-amount-desc',
              defaultNoQuery: true,
            },
          ],
        },
      ],
    },
    children: [
      {
        path: '',
        component: MigrationSearchPageComponent,
      },
      {
        path: 'detail/:pid',
        component: MigrationDataDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MigrationRoutingModule {}
