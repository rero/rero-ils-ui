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
import { getCurrencySymbol } from '@angular/common';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorComponent, JSONSchema7, RouteInterface } from '@rero/ng-core';
import { AcqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CanUpdateGuard } from '../../guard/can-update.guard';
import { BaseRoute } from '../../routes/base-route';
import { OrganisationService } from '../../service/organisation.service';

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
            editorSettings: {
              longMode: true,
            },
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType, true),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            redirectUrl: (record: any) => this.redirectUrl(record.metadata.acq_order, '/records/acq_orders/detail'),
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              const formOptions = jsonSchema.form;
              if (formOptions && formOptions.fieldMap === 'amount') {
                return this._amountSymbol(field);
              }
              return field;
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
    data.acq_order = {
      $ref: this._routeToolService.apiService.getRefEndpoint('acq_orders', this._routeToolService.getRouteQueryParam('order'))
    };
    return data;
  }

  /**
   * Make currency symbol before input
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _amountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    // TODO :: This isn't the organisation currency that we need to use, it's the order related vendor currency
    //         But how to retrieve the order from here ??? and how get quickly currency to use into
    const service = this._routeToolService.getInjectorToken(OrganisationService);
    field.templateOptions.addonLeft = {
      text: getCurrencySymbol(service.organisation.default_currency, 'wide')
    };
    return field;
  }
}
