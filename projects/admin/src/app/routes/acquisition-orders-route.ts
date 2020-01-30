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
import { RouteInterface, RecordSearchComponent, DetailComponent, EditorComponent } from '@rero/ng-core';
import { formatDate } from '@angular/common';
import { AcquisitionOrderBriefViewComponent } from '../record/brief-view/acquisition-order-brief-view.component';
import {
  AcquisitionOrderDetailViewComponent
} from '../record/detail-view/acquisition-order-detail-view/acquisition-order-detail-view.component';

export class AcquisitionOrdersRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_orders';

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
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Orders',
            component: AcquisitionOrderBriefViewComponent,
            detailComponent: AcquisitionOrderDetailViewComponent,
            canUpdate: (record: any) => this._routeToolService.canUpdate(record),
            canDelete: (record: any) => this._routeToolService.canDelete(record),
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.getCurrentUser();
              data.order_date = formatDate(
                new Date(),
                'yyyy-MM-dd',
                this._routeToolService.translateService.currentLang
              );
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.library.organisation.pid
                )
              };
              data.library = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'libraries',
                  user.currentLibrary
                )
              };
              return data;
            },
            aggregations: (aggregations: any) => this._routeToolService
              .aggregationFilter(aggregations),
            aggregationsExpand: ['library'],
            aggregationsOrder: [
              'library',
              'status'
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
}
