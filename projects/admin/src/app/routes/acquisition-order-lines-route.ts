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
import { AcqOrderLineGuard } from '../guard/acq-order-line.guard';
import {
  AcquisitionOrderLineDetailViewComponent
} from '../record/detail-view/acquisition-order-line-detail-view/acquisition-order-line-detail-view.component';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { BaseRoute } from './Base-route';
import { DetailComponent, EditorComponent, extractIdOnRef, RecordService, RouteInterface} from '@rero/ng-core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7 } from 'json-schema';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export class AcquisitionOrderLinesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_order_lines';

  /** Record type */
  readonly recordType = 'acq_order_lines';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent, canActivate: [ AcqOrderLineGuard ] }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Order lines',
            detailComponent: AcquisitionOrderLineDetailViewComponent,
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
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
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this.populateAcquisitionAccountsByCurrentUserLibrary(
                field, jsonSchema
              );
            },
          }
        ]
      }
    };
  }

  /**
   * Populate select menu with acquisition accounts of current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private populateAcquisitionAccountsByCurrentUserLibrary(
    field: FormlyFieldConfig,
    jsonSchema: JSONSchema7): FormlyFieldConfig {
    const formOptions = jsonSchema.form;
    if (formOptions && formOptions.fieldMap === 'acq_account') {
      field.type = 'select';
      const user = this._routeToolService.userService.getCurrentUser();
      const recordService = this._routeToolService.recordService;
      const apiService = this._routeToolService.apiService;
      const libraryPid = user.currentLibrary;
      const query = `library.pid:${libraryPid}`;
      field.templateOptions.options = recordService.getRecords(
        'acq_accounts',
        query, 1,
        RecordService.MAX_REST_RESULTS_SIZE
      ).pipe(
        map(result => result.hits.total === 0 ? [] : result.hits.hits),
        map(hits => {
          return hits.map((hit: any) => {
            return {
              label: hit.metadata.name,
              value: apiService.getRefEndpoint(
                'acq_accounts',
                hit.metadata.pid
              )
            };
          });
        })
      );
    }
    return field;
  }
}
