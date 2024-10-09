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
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ComponentCanDeactivateGuard, JSONSchema7, Record, RecordService, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { HoldingEditorComponent } from '../record/custom-editor/holding-editor/holding-editor.component';
import { HoldingDetailViewComponent } from '../record/detail-view/holding-detail-view/holding-detail-view.component';
import { HoldingPageDetailComponent } from '../record/detail-view/holding-detail-view/holding-page-detail/holding-page-detail.component';
import { BaseRoute } from './base-route';

export class HoldingsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'holdings';

  /** Record type */
  readonly recordType = 'holdings';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: HoldingPageDetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: HoldingEditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: HoldingEditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.HOLD_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Holdings',
            editorSettings: {
              longMode: true,
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            detailComponent: HoldingDetailViewComponent,
            canRead: (record: any) => this.canRead(record),
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.HOLD_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, true),
            preCreateRecord: (data: any) => {
              data.document = {
                $ref: this.routeToolService.apiService.getRefEndpoint(
                  'documents',
                  this.routeToolService.getRouteQueryParam('document')
                )
              };
              return data;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this.populateLocationsByCurrentUserLibrary(
                field, jsonSchema
              );
            },
            deleteMessage: (pid: string): Observable<string[]> => {
              return of([
                this.routeToolService.translateService.instant('Do you really want to delete this record?'),
                this.routeToolService.translateService.instant('This will also delete all items and issues of the holdings.')
              ]);
            },
            redirectUrl: (record: any, action: string) => {
              switch (action) {
                case 'delete':
                  return of(`/records/documents/detail/${record.metadata.document.pid}`);
                default:
                  return of(`/records/holdings/detail/${record.metadata.pid}`);
              }
            }
          }
        ]
      }
    };
  }

  /**
   * Populate select menu with locations of current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private populateLocationsByCurrentUserLibrary(
    field: FormlyFieldConfig,
    jsonSchema: JSONSchema7): FormlyFieldConfig {

    const formWidget = jsonSchema.widget;
    if (formWidget?.formlyConfig?.props?.fieldMap === 'location') {
      field.type = 'select';
      field.hooks = {
        ...field.hooks,
        afterContentInit: (f: FormlyFieldConfig) => {
          const { user } = this.routeToolService.userService;
          const { apiService, recordService } = this.routeToolService;
          const libraryPid = user.currentLibrary;
          const query = `library.pid:${libraryPid}`;
          f.props.options = recordService.getRecords(
            'locations',
            query, 1,
            RecordService.MAX_REST_RESULTS_SIZE,
            undefined,
            undefined,
            undefined,
            'name'
          ).pipe(
            map((result: Record) => this.routeToolService.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
            map((hits: any) => {
              return hits.map((hit: any) => {
                return {
                  label: hit.metadata.name,
                  value: apiService.getRefEndpoint(
                    'locations',
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
