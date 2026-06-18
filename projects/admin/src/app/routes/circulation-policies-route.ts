// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  JSONSchema7,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR, Tools } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResolveFn, Routes } from '@angular/router';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { CircPoliciesBriefViewComponent } from '../record/brief-view/circ-policies-brief-view.component';
import { CircPolicyDetailViewComponent } from '../record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { BaseRoute } from './base-route';

export const circulationPoliciesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new CirculationPoliciesRoute().getTypes();

export const circulationPoliciesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Circulation policies'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.CIPO_ACCESS, PERMISSIONS.CIPO_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Circulation policy'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Circulation policy'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Circulation policy'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.CIPO_CREATE],
    },
  },
];

class CirculationPoliciesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'circ_policies';

  /** Record type */
  readonly recordType = 'circ_policies';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Circulation policies'),
        editorSettings: {
          longMode: true,
        },
        component: CircPoliciesBriefViewComponent,
        detailComponent: CircPolicyDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.CIPO_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preCreateRecord: (data) => {
          if (data.parent == null) {
            data.organisation = {
              $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
            };
          }
          return data;
        },
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          const formWidget = jsonSchema.widget;
          if (formWidget?.formlyConfig?.props?.fieldMap) {
            switch (formWidget.formlyConfig.props.fieldMap) {
              case 'library':
                return this._populateLibraryByCurrentUser(field);
              case 'notification_template':
                return this._populateTemplate(field);
              case 'amount':
                return this._amountSymbol(field);
              case 'fee_amount':
                return this._feeAmountSymbol(field);
            }
          }
          return field;
        }) as any,
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            icon: 'fa fa-sort-amount-desc',
            defaultQuery: true,
          },
          {
            label: _('Name'),
            value: 'name',
            icon: 'fa fa-sort-alpha-asc',
            defaultNoQuery: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }

  /**
   * Populate library select menu
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _populateLibraryByCurrentUser(field: FormlyFieldConfig): FormlyFieldConfig {
    field.type = 'select';
    field.hooks = {
      ...field.hooks,
      afterContentInit: (f: FormlyFieldConfig) => {
        const apiService = this.routeToolService.apiService;
        const recordService: RecordService = this.routeToolService.recordService as RecordService;
        const query = `organisation.pid:${this.routeToolService.appStore.currentOrganisationPid()}`;
        f.props!.options = recordService
          .getRecords('libraries', { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: 'name' })
          .pipe(
            map((result: any) => (+recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits)),
            map((hits: any) => {
              return hits.map((hit: any) => {
                return {
                  label: hit.metadata.name,
                  value: apiService.getRefEndpoint('libraries', hit.metadata.pid),
                };
              });
            })
          );
      },
    };
    return field;
  }

  /**
   * Populate template select menu
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _populateTemplate(field: FormlyFieldConfig): FormlyFieldConfig {
    field.type = 'select';
    field.hooks = {
      ...field.hooks,
      afterContentInit: (f: FormlyFieldConfig) => {
        f.props!.options = this.routeToolService.httpClient.get('/api/notifications/templates/list').pipe(
          map((response: any) => {
            return response.templates.map((tpl: any) => {
              return { label: tpl, value: tpl };
            });
          })
        );
      },
    };
    return field;
  }

  /**
   * Make currency symbol before input
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _amountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    const org = this.routeToolService.appStore.organisation();
    if (org) {
      field.props!.addonLeft = [
        Tools.currencySymbol(this.routeToolService.translateService.getCurrentLang(), org.default_currency!),
      ];
    }
    return field;
  }

  /**
   * Make currency symbol before input and text after
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _feeAmountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    field = this._amountSymbol(field);
    field.props!.addonRight = ['/day'];
    return field;
  }
}
