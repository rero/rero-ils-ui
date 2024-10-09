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
import { getCurrencySymbol } from '@angular/common';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ComponentCanDeactivateGuard, EditorComponent, JSONSchema7, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { AcqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../../guard/can-access.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { OrganisationService } from '../../service/organisation.service';
import { CanAddOrderLineGuard } from './guards/can-add-order-line.guard';
import { IsBudgetActiveGuard } from './guards/is-budget-active.guard';

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
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard, IsBudgetActiveGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard, CanAddOrderLineGuard, AcqOrderLineGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.ACOL_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Order lines'),
            editorSettings: {
              longMode: true,
            },
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.ACOL_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, true),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            preUpdateRecord: (data: any) => this.fieldsToRemoved(data, ['is_current_budget']),
            redirectUrl: (record: any) => this.redirectUrl(record.metadata.acq_order, '/records/acq_orders/detail'),
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              const formWidget = jsonSchema.widget;
              if (formWidget?.formlyConfig?.props?.fieldMap === 'amount') {
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
   * Add default information's to an account record before creating it.
   * @param data: the data to improve
   * @return: the enrich data
   */
  private _addDefaultInformation(data: any): any {
    data.acq_order = {
      $ref: this.routeToolService.apiService.getRefEndpoint('acq_orders', this.routeToolService.getRouteQueryParam('order'))
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
    const service = this.routeToolService.getInjectorToken(OrganisationService);
    field.props.addonLeft = [
      getCurrencySymbol(service.organisation.default_currency, 'wide')
    ];
    return field;
  }
}
