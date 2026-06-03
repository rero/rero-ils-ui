/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { RecordSearchPageComponent, RecordType } from '@rero/ng-core';
import { CollectionBriefComponent } from '../collection-brief/collection-brief.component';
import { collectionAccessGuard } from '../guard/collection-access.guard';

export const collectionsRouteResolver: ResolveFn<Partial<RecordType>[]> = (route: ActivatedRouteSnapshot) => {
  const viewcode = route.params['viewcode'];
  return new CollectionsRoute().getTypes(viewcode);
};

export const collectionsRoutes: Routes = [
  {
    path: '',
    canActivate: [collectionAccessGuard],
    title: _('Exhibitions/courses'),
    component: RecordSearchPageComponent,
  },
];

class CollectionsRoute {
  getTypes(viewcode: string): Partial<RecordType>[] {
    return [
      {
        key: 'collections',
        component: CollectionBriefComponent,
        label: _('Exhibition/course'),
        aggregationsOrder: ['type', 'teacher', 'library', 'subject'],
        aggregationsExpand: ['type'],
        aggregationsBucketSize: 10,
        preFilters: {
          view: viewcode,
          published: '1',
          simple: '1',
        },
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            defaultQuery: true,
          },
          {
            label: _('Title'),
            value: 'title',
            defaultNoQuery: true,
          },
        ],
      },
    ];
  }
}
