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

import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { RecordSearchComponent } from '@rero/ng-core';
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

  /** Route name */
  private routeName = 'collections';

  /**
   * Constructor
   * @param translateService - TranslateService
   */
  constructor(translateService: TranslateService) {
    super(translateService);
  }

  /**
   * Resource name of route
   */
  getName() {
    return this.routeName;
  }

  /**
   * Create route
   * @param viewcode - string
   * @return dictionnary route configuration or null if loaded
   */
  create(viewcode: string): null | {} {
    if (!(this.availableConfig.some(v => v === viewcode))) {
      this.availableConfig.push(viewcode);

      return {
        matcher: (url: any) => this.routeMatcher(url, ['collections']),
        children: [
          { path: '', component: RecordSearchComponent, canActivate: [CollectionAccessGuard] }
        ],
        data: {
          adminMode: () => of({
            can: false,
            message: ''
          }),
          detailUrl: `/${viewcode}/:type/:pid`,
          types: [
            {
              key: this.getName(),
              component: CollectionBriefComponent,
              label: _('Collections'),
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
              }
            }
          ]
        }
      };
    }
  }
}
