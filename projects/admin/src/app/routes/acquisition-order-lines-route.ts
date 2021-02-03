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
import { DetailComponent, EditorComponent, JSONSchema7, Record, RecordService, RouteInterface } from '@rero/ng-core';
import { map } from 'rxjs/operators';
import { AcqOrderLineGuard } from '../guard/acq-order-line.guard';
import { CanUpdateGuard } from '../guard/can-update.guard';
import {
  AcquisitionOrderLineDetailViewComponent
} from '../record/detail-view/acquisition-order-line-detail-view/acquisition-order-line-detail-view.component';
import { BaseRoute } from './base-route';

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
        types: [
          {
            key: this.name,
            label: _('Order lines'),
            detailComponent: AcquisitionOrderLineDetailViewComponent,
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
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
              return this.redirectUrl(
                record.metadata.acq_order,
                '/records/acq_orders/detail'
              );
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
      field.hooks = {
        ...field.hooks,
        afterContentInit: (f: FormlyFieldConfig) => {
          const user = this._routeToolService.userService.user;
          const recordService = this._routeToolService.recordService;
          const apiService = this._routeToolService.apiService;
          const libraryPid = user.currentLibrary;
          const query = `library.pid:${libraryPid}`;
          f.templateOptions.options = recordService.getRecords(
            'acq_accounts',
            query, 1,
            RecordService.MAX_REST_RESULTS_SIZE
          ).pipe(
            map((result: Record) => this._routeToolService
              .recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
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
      };
    }
    return field;
  }
}
