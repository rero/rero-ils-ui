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
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../../guard/can-access.guard';
import { BaseRoute } from '../../routes/base-route';
import { OrganisationService } from '../../service/organisation.service';
import { IsBudgetActiveGuard } from './guards/is-budget-active.guard';

export class ReceiptLinesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_receipt_lines';
  /** Record type */
  readonly recordType = 'acq_receipt_lines';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard, IsBudgetActiveGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Receipt lines'),
            editorSettings: {
              longMode: true,
            },
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.ACRL_CREATE) }),
            preUpdateRecord: (data: any) => this.fieldsToRemoved(data, ['is_current_budget']),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, true),
            redirectUrl: (record: any) => this.redirectUrl(record.metadata.acq_receipt, '/records/acq_receipts/detail'),
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
