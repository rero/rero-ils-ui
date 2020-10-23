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
import { DetailComponent, RecordService, RouteInterface } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { JSONSchema7 } from 'json-schema';
import { map } from 'rxjs/operators';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { HoldingEditorComponent } from '../record/custom-editor/holding-editor/holding-editor.component';
import { HoldingDetailViewComponent } from '../record/detail-view/holding-detail-view/holding-detail-view.component';
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
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: HoldingEditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: HoldingEditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Holdings',
            editorSettings: {
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            detailComponent: HoldingDetailViewComponent,
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => {
              data.document = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'documents',
                  this._routeToolService.getRouteQueryParam('document')
                )
              };
              return data;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this.populateLocationsByCurrentUserLibrary(
                field, jsonSchema
              );
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
    const formOptions = jsonSchema.form;
    if (formOptions && formOptions.fieldMap === 'location') {
      field.type = 'select';
      const user = this._routeToolService.userService.getCurrentUser();
      const recordService = this._routeToolService.recordService;
      const apiService = this._routeToolService.apiService;
      const libraryPid = user.currentLibrary;
      const query = `library.pid:${libraryPid}`;
      recordService.getRecords(
        'locations',
        query, 1,
        RecordService.MAX_REST_RESULTS_SIZE,
        undefined,
        undefined,
        undefined,
        'name'
      ).pipe(
        map((result: Record) => this._routeToolService.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map(hits => {
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
      ).subscribe(options => field.templateOptions.options = options);
    }
    return field;
  }
}
