// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
