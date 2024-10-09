/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../../guard/can-access.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { ReceiptDetailViewComponent } from '../components/receipt/receipt-detail-view/receipt-detail-view.component';
import { IsBudgetActiveGuard } from './guards/is-budget-active.guard';

export class ReceiptsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_receipts';
  /** Record type */
  readonly recordType = 'acq_receipts';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ACRE_ACCESS, PERMISSIONS.ACRE_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard, IsBudgetActiveGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard, IsBudgetActiveGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Receipts'),
            detailComponent: ReceiptDetailViewComponent,
            editorSettings: {
              longMode: true,
            },
            searchFilters: [
              this.expertSearchFilter()
            ],
            preUpdateRecord: (data: any) => this._cleanRecord(data),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, true),
            aggregations: (aggregations: any) => this.routeToolService.aggregationFilter(aggregations),
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json'
            }
          }
        ]
      }
    };
  }

  private _cleanRecord(data: any): any {
    const fieldsToRemoved = ['total_amount', 'currency', 'quantity', 'receipt_lines', 'is_current_budget'];
    return this.fieldsToRemoved(data, fieldsToRemoved);
  }
}
