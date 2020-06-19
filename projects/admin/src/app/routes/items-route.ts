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
import { RouteInterface, DetailComponent, EditorComponent, RecordService } from '@rero/ng-core';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7 } from 'json-schema';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanUpdateGuard } from '../guard/can-update.guard';

export class ItemsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'items';

  /** Record type */
  readonly recordType = 'items';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        // TODO: add guards
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Items',
            detailComponent: ItemDetailViewComponent,
            canRead: (record: any) => this.canReadItem(record),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              // If we found an `holding` parameter into the query string then we need to pre-populated
              // the form with the corresponding holding metadata (see '_populateItemFieldFromHolding' function
              // to know which fields will be filled.
              const holdingPid = this._routeToolService.getRouteQueryParam('holding');
              if (holdingPid !== null) {
                this._populateItemFieldFromHolding(record, holdingPid);
              }
              return record;
            },
            preCreateRecord: (data: any) => {
              if (data.document == null) {
                data.document = {
                  $ref: this._routeToolService.apiService.getRefEndpoint(
                    'documents',
                    this._routeToolService.getRouteQueryParam('document')
                  )
                };
              }
              return data;
            },
            preUpdateRecord: (data: any) => {
              // remove dynamic field
              if (data.hasOwnProperty('available')) {
                delete data.available;
              }
              return data;
            },
            postprocessRecordEditor: (record: any) => {
              // As 'issue' is part of the JSON propertiesOrder. The record should always contain this property ;
              // But this property is only necessary for 'issue' item type.
              if (record.type !== 'issue' && record.hasOwnProperty('issue')) {
                delete record.issue;
              }
              // If we try to save an item with without any notes, then remove the empty array notes array from record
              if (record.notes && record.notes.length === 0) {
                delete record.notes;
              }
              return record;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this.populateLocationsByCurrentUserLibrary(
                field, jsonSchema
              );
            },
            redirectUrl: (record: any) => this.getUrl(record)
          }
        ]
      }
    };
  }

  /**
   * Get the url where redirect the user.
   * After editing an item, user should always redirect to the linked document except if
   * a `redirectTo` parameter is found in the query string
   * @param record - object, record to be saved
   * @return an observable on the url to redirect
   */
  private getUrl(record: any) {
    const redirectTo = this._routeToolService.getRouteQueryParam('redirectTo');
    return redirectTo
        ? of(redirectTo)
        : this.redirectUrl(
            record.metadata.document,
            '/records/documents/detail'
          )
    ;
  }

  /**
   * Check if the item is in the same organisation of connected user.
   * @param record - Object
   * @return Observable
   */
  private canReadItem(record: any) {
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

  /**
   * Populate item record from holding data
   *
   * For an issue item record, we need to set some default and/or static values for the record.
   * Some of theses values (record.type, record.issue.regular) are required by the JSON schema but are hidden into the form.
   * Some other fields will be pre-populated, based on corresponding url arguments
   *
   * @param record: the item record to populate
   * @param holdingPid: the holding pid
   */
  private _populateItemFieldFromHolding(record: any, holdingPid: string) {
    record.type = 'issue';
    record.issue = record.issue || {};
    record.issue.regular = true;  // default to true

    // setting irregular issue from url parameter
    try {
      // NOTE : Using `Boolean(JSON.parse(...`, values [1, '1', 'true', 'True'] from url will be considered as True.
      const isIrregular = Boolean(JSON.parse(this._routeToolService.getRouteQueryParam('irregular', 'false')));
      if (isIrregular) {
        record.issue.regular = false;
      }
    } catch (e) { }
    // setting other issue attributes from url parameters
    const today = this._routeToolService.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    record.issue.display_text = this._routeToolService.getRouteQueryParam('display_text', '');
    record.issue.expected_date = this._routeToolService.getRouteQueryParam('expected_date', today);
    record.issue.received_date = this._routeToolService.getRouteQueryParam('received_date', today);

    this._routeToolService.recordService.getRecord('holdings', holdingPid).subscribe(
      (holdingData) => {
        record.item_type = holdingData.metadata.circulation_category;
        record.location = holdingData.metadata.location;
        record.document = holdingData.metadata.document;
        record.holding = { $ref: this._routeToolService.apiService.getRefEndpoint('holdings', holdingPid) };
        if (holdingData.metadata.patterns.frequency === 'rdafr:1016') {  // 'rdafr:1016 --> 'irregular frequency'
          record.issue.regular = false;
        }
      }
    );
  }
}
