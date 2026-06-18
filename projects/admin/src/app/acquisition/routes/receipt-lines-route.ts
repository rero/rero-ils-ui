// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { BaseRoute } from '../../routes/base-route';
import { isBudgetActiveGuard } from './guards/is-budget-active.guard';

export const receiptLinesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new ReceiptLinesRoute().getTypes();

export const receiptLinesRoutes: Routes = [
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Receipt line'),
    canActivate: [canAccessGuard, isBudgetActiveGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
];

class ReceiptLinesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'acq_receipt_lines';
  /** Record type */
  readonly recordType = 'acq_receipt_lines';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Receipt lines'),
        editorSettings: {
          longMode: true,
        },
        canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.ACRL_CREATE), message: '' }),
        preUpdateRecord: (data: any) => this.fieldsToRemoved(data, ['is_current_budget']),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType, true),
        redirectUrl: (_record: RecordData) => {
          this.location.back();
          return of(null);
        },
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
