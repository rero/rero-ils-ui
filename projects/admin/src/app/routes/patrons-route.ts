/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { UntypedFormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  DetailComponent, EditorComponent, extractIdOnRef, JSONSchema7, Record, RecordSearchPageComponent, RecordService, RouteInterface
} from '@rero/ng-core';
import { of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CanUpdateGuard } from '../guard/can-update.guard';
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
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] },
        { path: 'new', component: EditorComponent }
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
              this.expertSearchFilter()
            ],
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              // set the patron expiration to now + 3 years if does not exists
              const defaultExpDate = new Date();
              defaultExpDate.setFullYear(defaultExpDate.getFullYear() + 3);
              record = {
                patron: {
                  expiration_date: this._routeToolService.datePipe.transform(defaultExpDate, 'yyyy-MM-dd')
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
              if (field.templateOptions.label === 'Role') {
                if (field.asyncValidators == null) {
                  field.asyncValidators = {};
                }
                field.asyncValidators.role = this._getRoleValidator(field);
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
  /**
   * Create an Async validator to avoid multiple organisation professional accounts.
   *
   * @param field - formly field config.
   */
   private _getRoleValidator(field: FormlyFieldConfig) {
    return {
      expression: (control: UntypedFormControl) => {
        const value = control.value;
        const userId = control.root.get('user_id').value;
        // user_id should be defined and a prof role should be selected
        if (userId == null || !value.some(role => ['librarian', 'system_librarian'].some(r => r === role))) {
          return of(true);
        }
        return this._routeToolService.recordService.getRecord('users', userId).pipe(
          debounceTime(1000),
          map((user: any) => {
            // current logged user organisation
            const currentOrgPid = this._routeToolService.userService.user.currentOrganisation;
            const patronAccounts = user.metadata.patrons;
            if (patronAccounts && patronAccounts.length > 0) {
              // accounts in other organisations
              return !patronAccounts.some(ptrn => {
                if (ptrn.organisation.pid !== currentOrgPid) {
                  if (ptrn.roles.some(role => ['librarian', 'system_librarian'].some(r => r === role))) {
                    return true;
                  }
                }
                return false;
              });
            }
            return true;
          })
        );
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
    if (formWidget?.formlyConfig?.templateOptions?.fieldMap === 'roles') {
      const values = Object.assign([], field.templateOptions.options);  // create a clone of original values
      field.templateOptions.options = this._routeToolService.recordPermissionService.getRolesManagementPermissions().pipe(
        map(results => {
          values.forEach((role: any) => role.disabled = !results.allowed_roles.includes(role.value));
          return values;
        })
      );
    }

    // LIBRARY MANAGEMENT -------------------------------------
    //   If current logged user doesn't have the 'system_librarian' role, then the only library available
    //   should be the current_user.current_library. Set default value for library select the current_library URI
    //   and disable the field (so the user can't change/manage other libraries)
    if (formWidget?.formlyConfig?.templateOptions?.fieldMap === 'libraries') {
      field.type = 'select';
      field.hooks = {
        ...field.hooks,
        afterContentInit: (f: FormlyFieldConfig) => {
          const recordService = this._routeToolService.recordService;
          const apiService = this._routeToolService.apiService;
          const libraryPid = this._routeToolService.userService.user.currentLibrary;
          let query = '';
          // Filter select for a librarian
          if (!this._routeToolService.userService.user.isSystemLibrarian) {
            // On edit record
            if (f.formControl.value) {
              const selectLibraryPid = extractIdOnRef(f.formControl.value);
              query = `pid:${selectLibraryPid}`;
              // If the current value is not the current librarian library
              // Deactivating the select menu
              if (selectLibraryPid !== libraryPid) {
                f.templateOptions.disabled = true;
              }
            } else {
              query = `pid:${libraryPid}`;
            }
          }
          f.templateOptions.options = recordService.getRecords(
            'libraries',
            query, 1,
            RecordService.MAX_REST_RESULTS_SIZE,
            undefined,
            undefined,
            undefined,
            'name'
          ).pipe(
            map((result: Record) => this._routeToolService
              .recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
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
    }
    return field;
  }
}
