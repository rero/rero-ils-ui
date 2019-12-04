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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';


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
          key: _('documents'),
          component: DocumentBriefComponent,
          label: _('Documents'),
          aggregations: AggregationFilter.filter,
          aggregationsOrder: [
            _('document_type'),
            _('author__fr'),
            _('author__en'),
            _('author__de'),
            _('author__it'),
            _('library'),
            _('organisation'),
            _('language'),
            _('subject'),
            _('status')
          ],
          aggregationsExpand: ['document_type'],
          aggregationsBucketSize: 10,
          listHeaders: {
            Accept: 'application/rero+json, application/json'
          },
          preFilters: {
            view: 'global'
          }
        },
        {
          key: _('persons'),
          component: PersonBriefComponent,
          label: _('Persons'),
          aggregationsExpand: ['sources']
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
          key: _('documents'),
          component: DocumentBriefComponent,
          label: _('Documents'),
          aggregations: AggregationFilter.filter,
          preFilters: {
            view: 'highlands'
          },
          listHeaders: {
            Accept: 'application/rero+json, application/json'
          }
        },
        {
          key: _('persons'),
          component: PersonBriefComponent,
          label: _('Persons'),
          aggregationsExpand: ['sources']
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
          key: _('documents'),
          label: _('Documents'),
          aggregations: AggregationFilter.filter,
          component: DocumentBriefComponent,
          preFilters: {
            view: 'aoste'
          },
          listHeaders: {
            Accept: 'application/rero+json, application/json'
          }
        },
        {
          key: _('persons'),
          component: PersonBriefComponent,
          label: _('Persons'),
          aggregationsExpand: ['sources']
        }
      ]
    }
  },
  {
    path: 'fictive/search',
    children: [
      { path: ':type', component: RecordSearchComponent },
      { path: ':type/detail/:pid', component: DetailComponent }
    ],
    data: {
      showSearchInput: false,
      adminMode: false,
      linkPrefix: '/fictive/search',
      detailUrl: '/fictive/:type/:pid',
      types: [
        {
          key: _('documents'),
          label: _('Documents'),
          aggregations: AggregationFilter.filter,
          component: DocumentBriefComponent,
          preFilters: {
            view: 'fictive'
          },
          listHeaders: {
            Accept: 'application/rero+json, application/json'
          }
        },
        {
          key: _('persons'),
          component: PersonBriefComponent,
          label: _('Persons'),
          aggregationsExpand: ['sources']
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
