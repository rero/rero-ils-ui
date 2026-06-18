// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
