/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { formatDate } from '@angular/common';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { CanUpdateGuard } from '../../guard/can-update.guard';
import { OrderBriefViewComponent } from '../components/order/order-brief-view/order-brief-view.component';
import { OrderDetailViewComponent } from '../components/order/order-detail-view/order-detail-view.component';
import { BaseRoute } from '../../routes/base-route';

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
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] },
        { path: 'new', component: EditorComponent }
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
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            preUpdateRecord: (data: any) => this._cleanRecord(data),
            aggregations: (aggregations: any) => this._routeToolService.aggregationFilter(aggregations),
            aggregationsExpand: [
              'library',
              'order_date',
              'status'
            ],
            aggregationsOrder: [
              'library',
              'status',
              'account',
              'vendor',
              'order_date',
              'type'
            ],
            aggregationsBucketSize: 10,
            listHeaders: {
              Accept: 'application/rero+json'
            }
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
    const user = this._routeToolService.userService.user;
    data.organisation = {
      $ref: this._routeToolService.apiService.getRefEndpoint('organisations', user.currentOrganisation)
    };
    data.library = {
      $ref: this._routeToolService.apiService.getRefEndpoint('libraries', user.currentLibrary)
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
      const fieldsToRemoved = ['total_amount', 'status'];
      fieldsToRemoved.forEach(key => {
        if (data.hasOwnProperty(key)) {
          delete data[key];
        }
      });
      return data;
    }
}
