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
import { DetailComponent, EditorComponent, extractIdOnRef, RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { LibraryGuard } from '../guard/library.guard';
import { LocationDetailViewComponent } from '../record/detail-view/location-detail-view/location-detail-view.component';
import { BaseRoute } from './base-route';


export class LocationsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'locations';

  /** Record type */
  readonly recordType = 'locations';

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
        { path: 'new', component: EditorComponent, canActivate: [ LibraryGuard ] }
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
            preprocessRecordEditor: (record: any) => {
              record.library = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'libraries',
                  this._routeToolService.getRouteQueryParam('library')
                )
              };
              return record;
            },
            redirectUrl: (record: any) => this.getUrl(record)
          }
        ]
      }
    };
  }

  /**
   * Parse url with pid from $ref
   * @param record - object, record to be saved
   */
  private getUrl(record: any) {
    const pid = extractIdOnRef(record.metadata.library.$ref);
    return of(`records/libraries/detail/` + pid);
  }
}
