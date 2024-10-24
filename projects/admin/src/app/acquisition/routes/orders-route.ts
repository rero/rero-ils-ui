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
import { of } from 'rxjs';
import { AcqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../../guard/can-access.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { OrderBriefViewComponent } from '../components/order/order-brief-view/order-brief-view.component';
import { OrderDetailViewComponent } from '../components/order/order-detail-view/order-detail-view.component';

export class OrdersRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_orders';
  /** Record type */
  readonly recordType = 'acq_orders';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ACOR_ACCESS, PERMISSIONS.ACOR_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanAccessGuard, AcqOrderLineGuard], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE, permissions: [ PERMISSIONS.ACOR_SEARCH ] } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.ACOR_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Orders'),
            component: OrderBriefViewComponent,
            detailComponent: OrderDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.ACOR_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, true),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            preUpdateRecord: (data: any) => this._cleanRecord(data),
            aggregations: (aggregations: any) => this.routeToolService.aggregationFilter(aggregations),
            aggregationsExpand: [
              'library',
              'order_date',
              'status'
            ],
            aggregationsOrder: [
              'budget',
              'library',
              'status',
              'account',
              'vendor',
              'order_date',
              'receipt_date',
              'type'
            ],
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json'
            },
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Receipt date (newest)'),
                value: 'receipt_date',
              },
              {
                label: _('Reference (asc)'),
                value: 'reference_asc',
              },
              {
                label: _('Reference (desc)'),
                value: 'reference_desc'
              },

              {
                label: _('Order date (newest)'),
                value: 'order_date_new'
              },
              {
                label: _('Order date (oldest)'),
                value: 'order_date_old',
              }
            ],
            exportFormats: [
              {
                label: 'CSV',
                format: 'csv',
                endpoint: this.routeToolService.apiService.getExportEndpointByType(this.recordType),
                disableMaxRestResultsSize: true,
              },
            ],
          }
        ]
      }
    };
  }

  /**
   * Add default informations to an account record before creating it.
   * @param data: the data to improve
   * @return: the enrich data
   */
  private _addDefaultInformation(data: any): any {
    const user = this.routeToolService.userService.user;
    data.organisation = {
      $ref: this.routeToolService.apiService.getRefEndpoint('organisations', user.currentOrganisation)
    };
    data.library = {
      $ref: this.routeToolService.apiService.getRefEndpoint('libraries', user.currentLibrary)
    };
    return data;
  }

  /**
   * Remove some fields from model. These field are added to record during
   * dumping but are not present into the `Order` JSON schema.
   * @param data: the data to update
   * @return: the cleaned data
   */
  private _cleanRecord(data: any): any {
    // remove dynamic fields
    const fieldsToRemoved = ['is_current_budget', 'status', 'order_date', 'account_statement'];
    return this.fieldsToRemoved(data, fieldsToRemoved);
  }
}
