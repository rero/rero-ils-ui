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
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DetailComponent, EditorComponent, RecordSearchComponent, RouteInterface } from '@rero/ng-core';
import { JSONSchema7 } from 'json-schema';
import { map } from 'rxjs/operators';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view.component';
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
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Users',
            editorSettings: {
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            component: PatronsBriefViewComponent,
            detailComponent: PatronDetailViewComponent,
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
              return record;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this._limitUserFormField(field, jsonSchema);
            },
            // use simple query for UI search
            preFilters: {
              simple: 1
            },
            aggregationsExpand: ['roles']
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
    const formOptions = jsonSchema.form;
    // ROLES FIELD MANAGEMENT ---------------------------------
    //   Depending of current user, the roles user can managed could be restricted.
    //   Call the 'role_management' API filter allowed roles. If user cannot manage a role, then this role
    //   will be disabled.  We can't hide the restricted role because if the edited user has already this role
    //   this information will be lost on save !
    if (formOptions && formOptions.fieldMap === 'roles') {
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
    if (formOptions && formOptions.fieldMap === 'library') {
      if (!this._routeToolService.userService.user.isLibrarian) {
        if (!field.hasOwnProperty('templateOptions')) {
          field.templateOptions = {};
        }
        const currentLibraryEndpoint = this._routeToolService.apiService.getRefEndpoint(
          'libraries',
          this._routeToolService.userService.user.getCurrentLibrary()
        );
        field.templateOptions.disabled = true;
        field.fieldGroup[0].defaultValue = currentLibraryEndpoint;
      }
    }
    return field;
  }
}
