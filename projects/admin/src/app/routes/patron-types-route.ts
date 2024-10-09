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
import { ComponentCanDeactivateGuard, DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { PatronTypesBriefViewComponent } from '../record/brief-view/patron-types-brief-view.component';
import { PatronTypesDetailViewComponent } from '../record/detail-view/patron-types-detail-view/patron-types-detail-view.component';
import { BaseRoute } from './base-route';


export class PatronTypesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'patron_types';

  /** Record type */
  readonly recordType = 'patron_types';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.PTTY_ACCESS, PERMISSIONS.PTTY_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.PTTY_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Patron types'),
            component: PatronTypesBriefViewComponent,
            detailComponent: PatronTypesDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.PTTY_CREATE) }),
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
            postprocessRecordEditor: (record: any) => {
              // Remove the possible unpaid limit if subscription amount isn't present or if subscription amount <= 0
              if (record.subscription_amount && record.subscription_amount <= 0 && record.limits && record.limits.unpaid_subscription) {
                delete record.limits.unpaid_subscription;
              }
              return record;
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
