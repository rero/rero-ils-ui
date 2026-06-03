/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { DetailComponent, RecordSearchPageComponent, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { permissionGuard } from '../../guard/permission.guard';
import { BudgetsBriefViewComponent } from '../components/budget/budget-brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from '../components/budget/budget-detail-view/budget-detail-view.component';

export const budgetsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new BudgetsRoute().getTypes();

export const budgetsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Budgets'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.BUDG_ACCESS, PERMISSIONS.BUDG_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Budget'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
];

class BudgetsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'budgets';
  /** Record type */
  readonly recordType = 'budgets';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Budgets'),
        component: BudgetsBriefViewComponent,
        detailComponent: BudgetDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
      },
    ];
  }
}
