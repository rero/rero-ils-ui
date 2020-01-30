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
import { RouteInterface, DetailComponent, EditorComponent, extractIdOnRef } from '@rero/ng-core';
import { BaseRoute } from './Base-route';
import {
  AcquisitionOrderLineDetailViewComponent
} from '../record/detail-view/acquisition-order-line-detail-view/acquisition-order-line-detail-view.component';
import { of } from 'rxjs';

export class AcquisitionOrderLinesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_order_lines';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Order lines',
            detailComponent: AcquisitionOrderLineDetailViewComponent,
            canAdd: () => this._routeToolService.canAddSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record),
            canDelete: (record: any) => this._routeToolService.canDelete(record),
            preCreateRecord: (data: any) => {
              data.acq_order = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'acq_orders',
                  this._routeToolService.getRouteQueryParam('order')
                )
              };
              return data;
            },
            redirectUrl: (record: any) => {
              const acqOrderPid = extractIdOnRef(record.metadata.acq_order.$ref);
              return of(`/records/acq_orders/detail/${acqOrderPid}`);
            }
          }
        ]
      }
    };
  }
}
