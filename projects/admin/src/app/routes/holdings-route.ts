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
import { BaseRoute } from './base-route';
import { RouteInterface, RecordService } from '@rero/ng-core';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { of } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7 } from 'json-schema';
import { map } from 'rxjs/operators';
import { HoldingEditorComponent } from '../record/custom-editor/holding-editor/holding-editor.component';
import { CanUpdateGuard } from '../guard/can-update.guard';

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
        { path: 'edit/:pid', component: HoldingEditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: HoldingEditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Holdings',
            // editorLongMode: true,

            detailComponent: ItemDetailViewComponent,
            canRead: (record: any) => this.canReadHolding(record),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
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
            },
            redirectUrl: (record: any) => {
              return this.redirectUrl(
                record.metadata.document,
                '/records/documents/detail'
              );
            }
          }
        ]
      }
    };
  }

  /**
   * Check if the item is in the same organisation of connected user.
   * @param record - Object
   * @return Observable
   */
  private canReadHolding(record: any) {
    const organisationPid = this._routeToolService.userService
      .getCurrentUser().library.organisation.pid;
    if ('organisation' in record.metadata) {
      return of({
        can: organisationPid === record.metadata.organisation.pid,
        message: ''
      });
    }
    return of({ can: false, message: '' });
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
      field.templateOptions.options = recordService.getRecords(
        'locations',
        query, 1,
        RecordService.MAX_REST_RESULTS_SIZE,
        undefined,
        undefined,
        undefined,
        'name'
      ).pipe(
        map(result => result.hits.total === 0 ? [] : result.hits.hits),
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
      );
    }
    return field;
  }
}
