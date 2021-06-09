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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorComponent, JSONSchema7, Record, RecordService, RouteInterface } from '@rero/ng-core';
import { map } from 'rxjs/operators';
import { AcqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CanUpdateGuard } from '../../guard/can-update.guard';
import { BaseRoute } from '../../routes/base-route';

export class OrderLinesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_order_lines';
  /** Record type */
  readonly recordType = 'acq_order_lines';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent, canActivate: [ AcqOrderLineGuard ] }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Order lines'),
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            redirectUrl: (record: any) => this.redirectUrl(record.metadata.acq_order, '/records/acq_orders/detail')
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
    data.acq_order = {
      $ref: this._routeToolService.apiService.getRefEndpoint('acq_orders', this._routeToolService.getRouteQueryParam('order'))
    };
    return data;
  }
}
