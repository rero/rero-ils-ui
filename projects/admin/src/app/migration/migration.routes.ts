// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Routes, UrlSegment } from '@angular/router';
import { _ } from "@ngx-translate/core";
import { RecordSearchPageComponent } from '@rero/ng-core';
import { of } from 'rxjs';
import { MigrationDataBriefComponent as ConversionMigrationDataComponent } from './conversion/record/brief-view/migration-data/migration-data.component';
import { MigrationDetailComponent } from './record/brief-view/migration/migration.component';

import { MigrationDataDetailComponent } from './conversion/record/detail-view/migration-data/migration-data.component';
import { MigrationDataDeduplicationBriefComponent } from './deduplication/record/brief-view/migration-data-deduplication/migration-data-deduplication.component';
import { MigrationSearchPageComponent } from './deduplication/record/search/migration-search-page.component';

export const MIGRATION_ROUTES: Routes = [
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
          canDelete: () => of(false),
          canAdd: () => of(false),
          canUpdate: () => of(false),
          aggregationsExpand: ['status'],
          aggregationsOrder: ['status'],
          aggregationsBucketSize: 10,
        },
      ],
    },
    children: [
      {
        path: '',
        title: _('Migrations'),
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
          canDelete: () => of(false),
          canAdd: () => of(false),
          canUpdate: () => of(false),
          aggregationsExpand: ['migration', 'conversion_status'],
          aggregationsOrder: ['migration', 'conversion_status'],
          aggregationsBucketSize: 10,
          sortOptions: [
            {
              label: _('Relevance'),
              value: '_score',
              icon: 'fa-solid fa-arrow-down-wide-short',
              defaultQuery: true,
            },
            {
              label: _('Modification date (newest)'),
              value: '-updated_at',
              icon: 'fa-solid fa-arrow-down-wide-short'
            },
            {
              label: _('Modification date (oldest)'),
              value: 'updated_at',
              icon: 'fa-solid fa-arrow-down-short-wide',
            },
            {
              label: _('Identifier'),
              value: '-_id',
              icon: 'fa-solid fa-arrow-down-a-z'
            },
          ],
        },
      ],
    },
    children: [
      {
        path: '',
        title: _('Migrations Data Conversion'),
        component: RecordSearchPageComponent,
      },
      {
        path: 'detail/:pid',
        title: _('Migrations Data Conversion'),
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
          canDelete: () => of(false),
          canAdd: () => of(false),
          canUpdate: () => of(false),
          aggregationsOrder: ['migration', 'deduplication_status', 'batch', 'modified_by'],
          aggregationsExpand: ['migration', 'deduplication_status', 'batch', 'modified_by'],
          aggregationsBucketSize: 10,
          sortOptions: [
            {
              label: _('Relevance'),
              value: '_score',
              icon: 'fa-solid fa-arrow-down-wide-short',
              defaultQuery: true,
            },
            {
              label: _('Modification date (newest)'),
              value: '-updated_at',
              icon: 'fa-solid fa-arrow-down-wide-short'
            },
            {
              label: _('Modification date (oldest)'),
              value: 'updated_at',
              icon: 'fa-solid fa-arrow-down-short-wide',
            },
            {
              label: _('Score'),
              value: '-deduplication.candidates.score',
              icon: 'fa-solid fa-arrow-down-wide-short',
              defaultNoQuery: true,
            },
          ],
        },
      ],
    },
    children: [
      {
        path: '',
        title: _('Migrations Data Deduplication'),
        component: MigrationSearchPageComponent,
      },
      {
        path: 'detail/:pid',
        title: _('Migrations Data Deduplication'),
        component: MigrationDataDetailComponent,
      },
    ],
  },
];
