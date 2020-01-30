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
import { BaseRoute } from './Base-route';
import { RouteInterface, DetailComponent, EditorComponent } from '@rero/ng-core';
import { LocationDetailViewComponent } from '../record/detail-view/location-detail-view/location-detail-view.component';

export class LocationsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'locations';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, 'locations'),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Locations',
            detailComponent: LocationDetailViewComponent,
            canAdd: () => this._routeToolService.canAddSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record),
            canDelete: (record: any) => this._routeToolService.canDelete(record),
            preCreateRecord: (record: any) => {
              record.library = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'libraries',
                  this._routeToolService.getRouteQueryParam('library')
                )
              };
              return record;
            }
          }
        ]
      }
    };
  }
}
