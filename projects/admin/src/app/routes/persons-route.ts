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
import { DetailComponent, RecordSearchComponent, RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { PersonsBriefViewComponent } from '../record/brief-view/persons-brief-view.component';
import { PersonDetailViewComponent } from '../record/detail-view/person-detail-view/person-detail-view.component';
import { BaseRoute } from './base-route';

export class PersonsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'persons';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent }
      ],
      data: {
        linkPrefix: 'records',
        adminMode: () => of({
          can: false,
          message: ''
        }),
        types: [
          {
            key: this.name,
            label: 'Persons',
            component: PersonsBriefViewComponent,
            detailComponent: PersonDetailViewComponent,
            aggregationsExpand: ['sources'],
            // use simple query for UI search
            preFilters: {
              simple: 1
            }
          }
        ]
      }
    };
  }
}
