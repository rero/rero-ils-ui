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
import { ComponentCanDeactivateGuard, DetailComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { LibrariesBriefViewComponent } from '../record/brief-view/libraries-brief-view.component';
import { LibraryComponent } from '../record/custom-editor/libraries/library.component';
import { LibraryDetailViewComponent } from '../record/detail-view/library-detail-view/library-detail-view.component';
import { BaseRoute } from './base-route';

export class LibrariesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'libraries';

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
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.LIB_ACCESS, PERMISSIONS.LIB_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: LibraryComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: LibraryComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard], data: { permissions: [ PERMISSIONS.LIB_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Libraries',
            component: LibrariesBriefViewComponent,
            detailComponent: LibraryDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.LIB_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => {
              const { user } = this.routeToolService.userService;
              data.organisation = {
                $ref: this.routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.currentOrganisation
                )
              };
              return data;
            },
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Name'),
                value: 'name',
                defaultNoQuery: true
              },
              {
                label: _('Code'),
                value: 'code'
              }
            ],
            showFacetsIfNoResults: true
          }
        ]
      }
    };
  }
}
