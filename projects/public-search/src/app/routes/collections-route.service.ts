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

import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RecordSearchPageComponent } from '@rero/ng-core';
import { of } from 'rxjs';
import { CollectionBriefComponent } from '../collection-brief/collection-brief.component';
import { CollectionAccessGuard } from '../guard/collection-access.guard';
import { BaseRoute } from './base-route';
import { ResourceRouteInterface } from './resource-route-interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionsRouteService extends BaseRoute implements ResourceRouteInterface {

  /** loaded configuration (viewcode) */
  private availableConfig = [];

  /**
   * Resource name of route(s)
   */
  getResources(): string[] {
    return ['collections'];
  }

  /**
   * Create route
   * @param viewcode - string
   * @return dictionary route configuration or null if loaded
   */
  create(viewcode: string): null | {} {
    if (!(this.availableConfig.some(v => v === viewcode))) {
      this.availableConfig.push(viewcode);

      return {
        path: `${viewcode}/search/:type`,
        children: [
          { path: '', component: RecordSearchPageComponent, canActivate: [CollectionAccessGuard] }
        ],
        data: {
          adminMode: () => of({
            can: false,
            message: ''
          }),
          detailUrl: `/${viewcode}/collections/:pid`,
          types: [
            {
              key: 'collections',
              component: CollectionBriefComponent,
              label: _('Exhibition/course'),
              aggregations: (aggregations: any) => this.aggFilter(aggregations),
              aggregationsOrder: ['type', 'teacher', 'library', 'subject'],
              aggregationsExpand: ['type'],
              aggregationsBucketSize: 10,
              preFilters: {
                view: `${viewcode}`,
                published: 1,
                simple: 1
              },
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              sortOptions: [
                {
                  label: _('Relevance'),
                  value: 'bestmatch',
                  defaultQuery: true
                },
                {
                  label: _('Title'),
                  value: 'title',
                  defaultNoQuery: true
                }
              ]
            }
          ]
        }
      };
    }
  }
}
