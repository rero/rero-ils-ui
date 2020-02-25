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
import { CirculationPolicyComponent } from '../record/custom-editor/circulation-settings/circulation-policy/circulation-policy.component';
import { CircPoliciesBriefViewComponent } from '../record/brief-view/circ-policies-brief-view.component';
import { CircPolicyDetailViewComponent } from '../record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { RoleGuard } from '../guard/role.guard';
import { RouteInterface, RecordSearchComponent, DetailComponent } from '@rero/ng-core';

export class CirculationPoliciesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'circ_policies';

  /** Record type */
  readonly recordType = 'circ_policies';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: CirculationPolicyComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: CirculationPolicyComponent, canActivate: [ RoleGuard ], data: { roles: [ 'system_librarian' ]}  }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Circulation policies',
            component: CircPoliciesBriefViewComponent,
            detailComponent: CircPolicyDetailViewComponent,
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType)
          }
        ]
      }
    };
  }
}
