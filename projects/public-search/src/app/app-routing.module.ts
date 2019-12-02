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
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordSearchComponent, DetailComponent } from '@rero/ng-core';
import { DocumentBriefComponent } from './document-brief/document-brief.component';
import { PersonBriefComponent } from './person-brief/person-brief.component';
import { TranslateService } from '@ngx-translate/core';
import { AggregationFilter } from './record/aggregation-filter';

const routes: Routes = [
  {
    path: 'global/search',
    // loadChildren: () => import('@rero/ng-core').then(m => m.RecordModule),
    children: [
      { path: ':type', component: RecordSearchComponent },
      { path: ':type/detail/:pid', component: DetailComponent }
    ],
    data: {
      showSearchInput: false,
      adminMode: false,
      linkPrefix: '/global/search',
      detailUrl: '/global/:type/:pid',
      types: [
        {
          key: 'documents',
          component: DocumentBriefComponent,
          label: 'Documents',
          aggregations: AggregationFilter.filter,
          aggregationsOrder: ['document_type', 'author', 'library', 'organisation', 'language', 'subject', 'status'],
          aggregationsExpand: ['document_type'],
          aggregationsBucketSize: 10
        },
        {
          key: 'persons',
          component: PersonBriefComponent,
          label: 'Persons'
        }
      ]
    }
  },
  {
    path: 'highlands/search',
    children: [
      { path: ':type', component: RecordSearchComponent },
      { path: ':type/detail/:pid', component: DetailComponent }
    ],
    data: {
      showSearchInput: false,
      adminMode: false,
      linkPrefix: '/highlands/search',
      detailUrl: '/highlands/:type/:pid',
      types: [
        {
          key: 'documents',
          component: DocumentBriefComponent,
          label: 'Documents',
          aggregations: AggregationFilter.filter,
          preFilters: {
            view: 'highlands'
          }
        },
        {
          key: 'persons',
          component: PersonBriefComponent,
          label: 'Persons'
        }
      ]
    }
  },
  {
    path: 'aoste/search',
    children: [
      { path: ':type', component: RecordSearchComponent },
      { path: ':type/detail/:pid', component: DetailComponent }
    ],
    data: {
      showSearchInput: false,
      adminMode: false,
      linkPrefix: '/aoste/search',
      detailUrl: '/aoste/:type/:pid',
      types: [
        {
          key: 'documents',
          label: 'Documents',
          aggregations: AggregationFilter.filter,
          component: DocumentBriefComponent,
          preFilters: {
            view: 'aoste'
          }
        },
        {
          key: 'persons',
          component: PersonBriefComponent,
          label: 'Persons'
        }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private translateService: TranslateService) {
    AggregationFilter.translateService = translateService;
  }
}
