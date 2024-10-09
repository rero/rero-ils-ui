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
import { ComponentCanDeactivateGuard, DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { IllRequestsBriefViewComponent } from '../record/brief-view/ill-requests-brief-view/ill-requests-brief-view.component';
import { IllRequestDetailViewComponent } from '../record/detail-view/ill-request-detail-view/ill-request-detail-view.component';
import { BaseRoute } from './base-route';

export class IllRequestsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'ill_requests';

  /** Record type */
  readonly recordType = 'ill_requests';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ILL_ACCESS, PERMISSIONS.ILL_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.ILL_CREATE ] } }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'ILL request',
            component: IllRequestsBriefViewComponent,
            detailComponent: IllRequestDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.ILL_CREATE) }),
            canUpdate: (record: any) => this.routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this.routeToolService.canDelete(record, this.recordType),
            aggregationsExpand: ['request_status', 'loan_status', 'requester'],
            aggregationsOrder: ['request_status', 'loan_status', 'requester', 'library'],
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            showFacetsIfNoResults: true
          }
        ]
      }
    };
  }
}
