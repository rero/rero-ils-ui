// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { ComponentCanDeactivateGuard, EditorComponent, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { BaseRoute } from '../../routes/base-route';
import { isBudgetActiveGuard } from './guards/is-budget-active.guard';

export const receiptsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new ReceiptsRoute().getTypes();

export const receiptsRoutes: Routes = [
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Receipt'),
    canActivate: [canAccessGuard, isBudgetActiveGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
];

class ReceiptsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'acq_receipts';
  /** Record type */
  readonly recordType = 'acq_receipts';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Receipts'),
        editorSettings: {
          longMode: true,
        },
        searchFilters: [this.expertSearchFilter()],
        preUpdateRecord: (data: any) => this._cleanRecord(data),
      },
    ];
  }

  private _cleanRecord(data: any): any {
    const fieldsToRemoved = ['total_amount', 'currency', 'quantity', 'receipt_lines', 'is_current_budget'];
    return this.fieldsToRemoved(data, fieldsToRemoved);
  }
}
