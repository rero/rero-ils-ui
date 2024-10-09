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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { ComponentCanDeactivateGuard, DetailComponent, EditorComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { LibraryGuard } from '../guard/library.guard';
import { PermissionGuard } from '../guard/permission.guard';
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
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard, LibraryGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.LOC_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Locations'),
            detailComponent: LocationDetailViewComponent,
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.LOC_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              // Location resource use a asynchronous validator ('valueAlreadyExists').
              // This validator needs the library pid to work ; but in creation mode, the record.library.pid isn't yet known by system
              // so we use the 'library' query parameter to construct this data (only if the resource isn't already related to a library)
              if (record.library == null && this.routeToolService.getRouteQueryParam('library') != null) {
                record.library = {
                  $ref: this.routeToolService.apiService.getRefEndpoint(
                    'libraries',
                    this.routeToolService.getRouteQueryParam('library')
                  )
                };
              }
              return record;
            },
            postprocessRecordEditor: (record: any) => {
              if (!record.allow_request || !record.send_notification) {
                delete record.send_notification;
                delete record.notification_email;
              }
              return record;
            },
            redirectUrl: (record: any) => {
              return this.redirectUrl(
                record.metadata.library,
                '/records/libraries/detail'
              );
            }
          }
        ]
      }
    };
  }
}
