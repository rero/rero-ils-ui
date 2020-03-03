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
import { CanUpdateGuard } from '../guard/can-update.guard';
import { RouteInterface, DetailComponent, EditorComponent } from '@rero/ng-core';
import { LocationDetailViewComponent } from '../record/detail-view/location-detail-view/location-detail-view.component';

export class LocationsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'locations';

  /** Record type */
  readonly recordType = 'libraries';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Locations',
            detailComponent: LocationDetailViewComponent,
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
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
