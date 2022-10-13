/*
 * RERO ILS UI
 * Copyright (C) 2020-2022 RERO
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
import { TranslateService } from '@ngx-translate/core';
import {
  DetailComponent, EditorComponent, JSONSchema7, Record,
  RecordSearchPageComponent, RecordService, RouteInterface
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR, User } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanAccessGuard, CAN_ACCESS_ACTIONS } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { CircPoliciesBriefViewComponent } from '../record/brief-view/circ-policies-brief-view.component';
import { CircPolicyDetailViewComponent } from '../record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { OrganisationService } from '../service/organisation.service';
import { BaseRoute } from './base-route';

export class CirculationPoliciesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'circ_policies';

  /** Record type */
  readonly recordType = 'circ_policies';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIPO_ACCESS, PERMISSIONS.CIPO_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIPO_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Circulation policies'),
            editorSettings: {
              longMode: true
            },
            component: CircPoliciesBriefViewComponent,
            detailComponent: CircPolicyDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this._routeToolService.permissionsService.canAccess(PERMISSIONS.CIPO_CREATE) }),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => {
              const user: User = this._routeToolService.userService.user;
              if (data.parent == null) {
                data.organisation = {
                  $ref: this._routeToolService.apiService.getRefEndpoint(
                    'organisations',
                    user.currentOrganisation
                  )
                };
              }
              return data;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              const formWidget = jsonSchema.widget;
              if (formWidget?.formlyConfig?.templateOptions?.fieldMap) {
                switch (formWidget.formlyConfig.templateOptions.fieldMap) {
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
            },
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Name'),
                value: 'name',
                defaultNoQuery: true
              }
            ],
            showFacetsIfNoResults: true
          }
        ]
      }
    };
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
        const user = this._routeToolService.userService.user;
        const recordService = this._routeToolService.recordService;
        const apiService = this._routeToolService.apiService;
        const query = `organisation.pid:${user.currentOrganisation}`;
        f.templateOptions.options = recordService.getRecords(
          'libraries',
          query, 1,
          RecordService.MAX_REST_RESULTS_SIZE,
          undefined,
          undefined,
          undefined,
          'name'
        ).pipe(
          map((result: Record) =>
            this._routeToolService.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
          map(hits => {
            return hits.map((hit: any) => {
              return {
                label: hit.metadata.name,
                value: apiService.getRefEndpoint(
                  'libraries',
                  hit.metadata.pid
                )
              };
            });
          })
        );
      }
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
        f.templateOptions.options = this._routeToolService.httpClient
          .get('/api/notifications/templates/list')
          .pipe(
            map((response: any) => {
              return response.templates.map((tpl: any) => {
                return { label: tpl, value: tpl };
              });
            })
          );
      }
    };
    return field;
  }

  /**
   * Make currency symbol before input
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _amountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    const service = this._routeToolService.getInjectorToken(OrganisationService);
    field.templateOptions.addonLeft = {
      text: getCurrencySymbol(service.organisation.default_currency, 'wide')
    };
    return field;
  }

  /**
   * Make currency symbol before input and text after
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private _feeAmountSymbol(field: FormlyFieldConfig): FormlyFieldConfig {
    const translate = this._routeToolService.getInjectorToken(TranslateService);
    field = this._amountSymbol(field);
    field.templateOptions.addonRight = {
      text: '/ ' + translate.instant('day')
    };
    return field;
  }
}
