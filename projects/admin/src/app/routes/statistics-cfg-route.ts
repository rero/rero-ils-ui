/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from "@rero/ng-core";
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CanAccessGuard, CAN_ACCESS_ACTIONS } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { StatisticsCfgBriefViewComponent } from '../record/brief-view/statistics-cfg-brief-view-component';
import { StatisticsCfgDetailViewComponent } from '../record/detail-view/statistics-cfg-detail-view/statistics-cfg-detail-view.component';
import { BaseRoute } from "./base-route";

export class StatisticsCfgRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'stats_cfg';

  /** Record type */
  readonly recordType = 'stats_cfg';

  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.STAT_CFG_ACCESS, PERMISSIONS.STAT_CFG_SEARCH ], operator: PERMISSION_OPERATOR.AND }},
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.STAT_CFG_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Statistics configuration'),
            editorSettings: {
              longMode: true,
            },
            component: StatisticsCfgBriefViewComponent,
            detailComponent: StatisticsCfgDetailViewComponent,
            aggregationsBucketSize: 10,
            aggregationsExpand: [
              'category'
            ],
            aggregationsOrder: [
              'category'
            ],
            canAdd: () => of({ can: this._routeToolService.permissionsService.canAccess(PERMISSIONS.STAT_CFG_CREATE) }),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.user;
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.currentOrganisation
                )
              };
              return data;
            },
          }
        ]
      }
    };
  }
}
