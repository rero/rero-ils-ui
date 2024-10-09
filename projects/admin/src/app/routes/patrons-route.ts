/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import {
  ComponentCanDeactivateGuard,
  DetailComponent, EditorComponent,
  JSONSchema7, Record, RecordSearchPageComponent, RecordService, RouteInterface
} from '@rero/ng-core';
import { ILibrary, IPatron, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view/patrons-brief-view.component';
import { PatronDetailViewComponent } from '../record/detail-view/patron-detail-view/patron-detail-view.component';
import { BaseRoute } from './base-route';

export class PatronsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'patrons';

  /** Record type */
  readonly recordType = 'patrons';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.PTRN_ACCESS, PERMISSIONS.PTRN_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.PTRN_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Users'),
            editorSettings: {
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            component: PatronsBriefViewComponent,
            detailComponent: PatronDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter(),
              {
                'label': 'Show only:',
                filters: [
                  {
                    label: _('Expired'),
                    filter: 'expired',
                    value: 'true',
                    showIfQuery: true
                  },
                  {
                    label: _('Blocked'),
                    filter: 'blocked',
                    value: 'true',
                    showIfQuery: true
                  }
                ]
              }
            ],
            canAdd: () => of({ 'can': this.routeToolService.permissionsService.canAccess(PERMISSIONS.PTRN_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            canUpdate: (record: any) => this.routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this.routeToolService.canDelete(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              // set the patron expiration to now + 3 years if does not exists
              const defaultExpDate = new Date();
              defaultExpDate.setFullYear(defaultExpDate.getFullYear() + 3);
              record = {
                patron: {
                  expiration_date: this.routeToolService.datePipe.transform(defaultExpDate, 'yyyy-MM-dd')
                }
                , ...record
              };
              return record;
            },
            postprocessRecordEditor: (record: any) => {
              // Clean-up 'blocked_note' field content if blocked is false.
              if (record.blocked === false) {
                delete record.blocked_note;
              }
              // Clean-up 'patron' data from record if the patron doesn't have the 'patron' role
              if (!record.roles.includes('patron') && 'patron' in record) {
                delete record.patron;
              }
              return record;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              if (field.props.label === 'Role' && field.asyncValidators == null) {
                    field.asyncValidators = {};
              }
              return this._limitUserFormField(field, jsonSchema);
            },
            aggregationsExpand: ['roles', 'city', 'patron_type'],
            aggregationsOrder: ['roles', 'city', 'patron_type'],
            allowEmptySearch: false,
            listHeaders: {
              Accept: 'application/rero+json'
            },
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Name'),
                value: 'full_name'
              }
            ],
            showFacetsIfNoResults: true
          }
        ]
      }
    };
  }

  /** Limit some field from user editor.
   *
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _limitUserFormField(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
    // ROLES FIELD MANAGEMENT ---------------------------------
    //   Depending of current user, the roles user can managed could be restricted.
    //   Call the 'role_management' API filter allowed roles. If user cannot manage a role, then this role
    //   will be disabled.  We can't hide the restricted role because if the edited user has already this role
    //   this information will be lost on save !
    const formWidget = jsonSchema.widget;
    if (formWidget?.formlyConfig?.props?.fieldMap === 'roles') {
      const values = Object.assign([], field.props.options);  // create a clone of original values
      field.props.options = this.routeToolService.recordPermissionService.getRolesManagementPermissions().pipe(
        map((results: any) => {
          values.forEach((role: any) => role.disabled = !results.allowed_roles.includes(role.value));
          return values;
        })
      );
    }

    // LIBRARY MANAGEMENT -------------------------------------
    //   If current logged user doesn't have the 'system_librarian' role, then the only library available
    //   should be the current_user.current_library. Set default value for library select the current_library URI
    //   and disable the field (so the user can't change/manage other libraries)
    if (formWidget?.formlyConfig?.props?.fieldMap === 'libraries') {
      field.type = 'select';
      field.hooks = {
        ...field.hooks,
        afterContentInit: (f: FormlyFieldConfig) => {
          const { user } = this.routeToolService.userService;
          const { apiService, recordService } = this.routeToolService;

          // Extract libraries from patron > libraries
          const libraries = [];
          user.patrons.map((patron: IPatron) => {
            patron.libraries.map((library: ILibrary) => {
              libraries.push(library.pid);
            });
          });

          f.props.options = recordService.getRecords(
            'libraries',
            `pid:${libraries.join(' OR pid:')}`, 1,
            RecordService.MAX_REST_RESULTS_SIZE,
            undefined,
            undefined,
            undefined,
            'name'
          ).pipe(
            map((result: Record) => this.routeToolService
              .recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
            map((hits: any) => {
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
    }
    return field;
  }
}
