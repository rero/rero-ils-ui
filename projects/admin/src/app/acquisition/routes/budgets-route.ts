/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2022 UCLouvain
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
import { BaseRoute } from '@app/admin/routes/base-route';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../../guard/can-access.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { BudgetsBriefViewComponent } from '../components/budget/budget-brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from '../components/budget/budget-detail-view/budget-detail-view.component';

export class BudgetsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'budgets';
  /** Record type */
  readonly recordType = 'budgets';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.BUDG_ACCESS, PERMISSIONS.BUDG_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } }
      ],
      data: {
        adminMode: this.DISABLED,
        types: [
          {
            key: this.name,
            label: _('Budgets'),
            component: BudgetsBriefViewComponent,
            detailComponent: BudgetDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ]
          }
        ]
      }
    };
  }
}
