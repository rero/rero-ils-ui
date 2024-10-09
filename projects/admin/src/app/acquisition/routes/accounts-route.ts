/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { getCurrencySymbol } from '@angular/common';
import { AccountDetailViewComponent } from '@app/admin/acquisition/components/account/account-detail-view/account-detail-view.component';
import { CanAddAccountGuard } from '@app/admin/acquisition/routes/guards/can-add-account.guard';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '@app/admin/guard/can-access.guard';
import { PermissionGuard } from '@app/admin/guard/permission.guard';
import { BaseRoute } from '@app/admin/routes/base-route';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ComponentCanDeactivateGuard, DetailComponent, EditorComponent, JSONSchema7, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';

/** Export formats configuration. */
export const exportFormats = [{
   label: 'CSV',
   format: 'csv',
   disableMaxRestResultsSize: true
}];

export class AccountsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_accounts';
  /** Record type */
  readonly recordType = 'acq_accounts';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard, CanAddAccountGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.ACAC_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Acquisition account'),
            detailComponent: AccountDetailViewComponent,
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => this._addDefaultInformation(data),
            redirectUrl: () => of('/acquisition/accounts'),
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
   * @param data - the data to improve
   * @return the enrich data
   */
  private _addDefaultInformation(data: any): any {
    const { user } = this.routeToolService.userService;
    data.library = {
      $ref: this.routeToolService.apiService.getRefEndpoint('libraries', user.currentLibrary)
    };
    data.budget = {
      $ref: this.routeToolService.apiService.getRefEndpoint('budgets', this.routeToolService.getRouteQueryParam('budget'))
    };
    return data;
  }

  /**
   * Make currency symbol before input
   * @param field - the field configuration.
   * @return The updated configuration.
   */
  private _amountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    const service = this.routeToolService.getInjectorToken(OrganisationService);
    if (service.organisation) {
      field.props.addonLeft = [
        getCurrencySymbol(service.organisation.default_currency, 'wide')
      ];
    }
    return field;
  }
}
