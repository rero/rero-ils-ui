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
import { DetailComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { ContributionBriefComponent } from '@rero/shared';
import { ContributionDetailViewComponent } from '../record/detail-view/contribution-detail-view/contribution-detail-view.component';
import { BaseRoute } from './base-route';

export class CorporateBodiesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'corporate-bodies';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent }
      ],
      data: {
        adminMode: () => of({
          can: false,
          message: ''
        }),
        types: [
          {
            key: 'corporate-bodies',
            index: 'contributions',
            label: 'corporate-bodies',
            component: ContributionBriefComponent,
            detailComponent: ContributionDetailViewComponent,
            aggregationsOrder: ['sources'],
            aggregationsExpand: ['sources'],
            // use simple query for UI search
            preFilters: {
              type: 'bf:Organisation',
              simple: 1
            }
          }
        ]
      }
    };
  }
}
