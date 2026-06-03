/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ComponentCanDeactivateGuard,
  EditorComponent,
  JSONSchema7,
  RecordData,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, Tools } from '@rero/shared';
import { of } from 'rxjs';
import { acqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { permissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { canAddOrderLineGuard } from './guards/can-add-order-line.guard';
import { isBudgetActiveGuard } from './guards/is-budget-active.guard';

export const orderLinesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new OrderLinesRoute().getTypes();

export const orderLinesRoutes: Routes = [
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Order line'),
    canActivate: [canAccessGuard, isBudgetActiveGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Order line'),
    canActivate: [permissionGuard, canAddOrderLineGuard, acqOrderLineGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.ACOL_CREATE],
    },
  },
];

class OrderLinesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'acq_order_lines';
  /** Record type */
  readonly recordType = 'acq_order_lines';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Order lines'),
        canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.ACOL_CREATE), message: '' }),
        preCreateRecord: (data: any) => this._addDefaultInformation(data),
        preUpdateRecord: (data: any) => this.fieldsToRemoved(data, ['is_current_budget']),
        redirectUrl: (record: RecordData) =>
          this.redirectUrl(record.metadata.acq_order, '/acquisition/records/acq_orders/detail'),
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          const formWidget = jsonSchema.widget;
          if (formWidget?.formlyConfig?.props?.fieldMap === 'amount') {
            return this._amountSymbol(field);
          }
          return field;
        }) as any,
      },
    ];
  }

  /**
   * Add default information's to an account record before creating it.
   * @param data: the data to improve
   * @return: the enrich data
   */
  private _addDefaultInformation(data: any): any {
    data.acq_order = {
      $ref: this.routeToolService.apiService.getRefEndpoint(
        'acq_orders',
        this.routeToolService.getRouteQueryParam('order')
      ),
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
    const org = this.routeToolService.appStore.organisation();
    if (org) {
      field.props!.addonLeft = [
        Tools.currencySymbol(this.routeToolService.translateService.getCurrentLang(), org.default_currency!),
      ];
    }
    return field;
  }
}
