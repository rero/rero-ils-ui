/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
 * Copyright (C) 2022-2023 UCLouvain
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
import { AccountDetailViewComponent } from '@app/admin/acquisition/components/account/account-detail-view/account-detail-view.component';
import { canAddAccountGuard } from '@app/admin/acquisition/routes/guards/can-add-account.guard';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '@app/admin/guard/can-access.guard';
import { permissionGuard } from '@app/admin/guard/permission.guard';
import { BaseRoute } from '@app/admin/routes/base-route';
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  JSONSchema7,
  RecordData,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { of } from 'rxjs';
import { PERMISSIONS, Tools } from '@rero/shared';

/** Export formats configuration. */
export const exportFormats = [
  {
    label: 'CSV',
    format: 'csv',
    disableMaxRestResultsSize: true,
  },
];

export const accountsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new AccountsRoute().getTypes();

export const accountsRoutes: Routes = [
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Accounts'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Account'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Account'),
    canActivate: [permissionGuard, canAddAccountGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.ACAC_CREATE],
    },
  },
];

class AccountsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'acq_accounts';
  /** Record type */
  readonly recordType = 'acq_accounts';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Acquisition account'),
        detailComponent: AccountDetailViewComponent,
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preCreateRecord: (data: any) => this._addDefaultInformation(data),
        redirectUrl: () => of('/acquisition/accounts'),
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
   * @param data - the data to improve
   * @return the enrich data
   */
  private _addDefaultInformation(data: any): any {
    data.library = {
      $ref: this.routeToolService.apiService.getRefEndpoint('libraries', this.routeToolService.appStore.currentLibraryPid()),
    };
    data.budget = {
      $ref: this.routeToolService.apiService.getRefEndpoint(
        'budgets',
        this.routeToolService.getRouteQueryParam('budget')
      ),
    };
    return data;
  }

  /**
   * Make currency symbol before input
   * @param field - the field configuration.
   * @return The updated configuration.
   */
  private _amountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    const org = this.routeToolService.appStore.organisation();
    if (org) {
      field.props.addonLeft = [
        Tools.currencySymbol(this.routeToolService.translateService.getCurrentLang(), org.default_currency),
      ];
    }
    return field;
  }
}
