/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import {
  ItemSwitchLocationStandaloneComponent
} from '@app/admin/components/items/switch-location/item-switch-location-standalone/item-switch-location-standalone.component';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ComponentCanDeactivateGuard, EditorComponent, JSONSchema7, Record, RecordSearchPageComponent, RecordService, RouteInterface } from '@rero/ng-core';
import { IssueItemStatus, PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemType } from '../classes/items';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { ItemsBriefViewComponent } from '../record/brief-view/items-brief-view/items-brief-view.component';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { ItemPageDetailComponent } from '../record/detail-view/item-detail-view/item-page-detail/item-page-detail.component';
import { BaseRoute } from './base-route';

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
    const config = {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ITEM_ACCESS, PERMISSIONS.ITEM_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: ItemPageDetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'switch_location/:pid', component: ItemSwitchLocationStandaloneComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.HOLD_CREATE, PERMISSIONS.ITEM_CREATE ], permissionsOperator: PERMISSION_OPERATOR.AND } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Items',
            editorSettings: {
              longMode: true,
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            component: ItemsBriefViewComponent,
            detailComponent: ItemDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            preFilters: {
              organisation: null
            },
            canRead: (record: any) => this.canRead(record),
            canAdd: () => of({can: false}),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType, false),
            preprocessRecordEditor: (record: any) => {
              // If we found an `holding` parameter into the query string then we need to pre-populated
              // the form with the corresponding holding metadata (see '_populateItemFieldFromHolding' function
              // to know which fields will be filled.
              const holdingPid = this.routeToolService.getRouteQueryParam('holding');
              if (holdingPid !== null) {
                this._populateItemFieldFromHolding(record, holdingPid);
              }
              return record;
            },
            preCreateRecord: (data: any) => {
              if (data.document == null) {
                data.document = {
                  $ref: this.routeToolService.apiService.getRefEndpoint(
                    'documents',
                    this.routeToolService.getRouteQueryParam('document')
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
              // * As 'issue' is part of the JSON propertiesOrder. The record should always contain this property ;
              //   But this property is only necessary for 'issue' item type.
              // * Keep 'received_date' information only if the issue has the correct status.
              if (record.issue) {
                if (record.type !== 'issue') {
                  delete record.issue;
                } else if (record.issue.status !== IssueItemStatus.RECEIVED && record.issue.received_date) {
                  delete record.issue.received_date;
                }
              }
              // If we try to save an item with without any notes, then remove the empty array notes array from record
              if (record.notes && record.notes.length === 0) {
                delete record.notes;
              }
              // If we save an item with 'new_acquisition' flag set to false, ensure than we don't send any acquisition_date
              if (!record.hasOwnProperty('acquisition_date') && record.acquisition_date == null) {
                delete record.acquisition_date;
              }
              return record;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this._populateLocationsByCurrentUserLibrary(field, jsonSchema);
            },
            redirectUrl: (record: any) => this.getUrl(record),
            aggregationsBucketSize: 10,
            aggregationsOrder: [
              'document_type',
              'library',
              'location',
              'item_type',
              'temporary_location',
              'temporary_item_type',
              'status',
              'current_requests'
            ],
            aggregationsExpand: [
              'document_type',
              'library',
              'location',
            ],
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            exportFormats: [
              {
                label: 'CSV',
                format: 'csv',
                endpoint: this.routeToolService.apiService.getEndpointByType('item/inventory'),
                disableMaxRestResultsSize: true,
              },
            ],
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Barcode'),
                value: 'barcode'
              },
              {
                label: _('Barcode (desc)'),
                value: '-barcode'
              },
              {
                label: _('Call number'),
                value: 'call_number'
              },
              {
                label: _('Call number (desc)'),
                value: '-call_number'
              },
              {
                label: _('Second call number'),
                value: 'second_call_number'
              },
              {
                label: _('Second call number (desc)'),
                value: '-second_call_number'
              },
              {
                label: _('Current requests'),
                value: 'current_requests'
              }
            ]
          }
        ],
      }
    };
    // TODO: Refactor this after the change of AppInitializer service with user.
    this.routeToolService.userService.loaded$.subscribe(() => {
      const { patronLibrarian } = this.routeToolService.userService.user;
      if (patronLibrarian) {
        config.data.types[0].preFilters.organisation = patronLibrarian.organisation.pid;
      }
    });

    return config;
  }

  /**
   * Get the url where redirect the user.
   * After editing an item, user should always redirect to the linked document except if
   * a `redirectTo` parameter is found in the query string
   * @param record - object, record to be saved
   * @return an observable on the url to redirect
   */
  private getUrl(record: any) {
    const redirectTo = this.routeToolService.getRouteQueryParam('redirectTo');
    return redirectTo
        ? of(redirectTo)
        : this.redirectUrl(
            record.metadata.document,
            '/records/documents/detail'
          )
    ;
  }

  /**
   * Populate select menu with locations of current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _populateLocationsByCurrentUserLibrary(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
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
          f.props.options = recordService
            .getRecords('locations', query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, 'name')
            .pipe(
              map((result: Record) => this.routeToolService.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
              map((hits: Array<Record>) =>
                hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint('locations',hit.metadata.pid)
                  };
                })
              )
            );
        }
      };
    }
    return field;
  }

  /**
   * Populate item record from holding data
   *
   * For an issue item record, we need to set some default and/or static values for the record.
   * Some of these values (record.type, record.issue.regular) are required by the JSON schema but are hidden into the form.
   * Some other fields will be pre-populated, based on corresponding url arguments
   *
   * @param record: the item record to populate
   * @param holdingPid: the holding pid
   */
  private _populateItemFieldFromHolding(record: any, holdingPid: string) {
    record.type = ItemType.ISSUE;
    record.issue = record.issue || {};
    record.issue.regular = true;  // default to true

    // setting irregular issue from url parameter
    try {
      // NOTE : Using `Boolean(JSON.parse(...`, values [1, '1', 'true', 'True'] from url will be considered as True.
      const isIrregular = Boolean(JSON.parse(this.routeToolService.getRouteQueryParam('irregular', 'false')));
      if (isIrregular) {
        record.issue.regular = false;
      }
    } catch (e) { }
    // setting other issue attributes from url parameters
    const today = this.routeToolService.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    record.enumerationAndChronology = this.routeToolService.getRouteQueryParam('enumerationAndChronology', '');
    record.issue.expected_date = this.routeToolService.getRouteQueryParam('expected_date', today);
    record.issue.received_date = this.routeToolService.getRouteQueryParam('received_date', today);

    this.routeToolService.recordService.getRecord('holdings', holdingPid).subscribe(
      (holdingData) => {
        record.item_type = holdingData.metadata.circulation_category;
        record.location = holdingData.metadata.location;
        record.document = holdingData.metadata.document;
        record.holding = { $ref: this.routeToolService.apiService.getRefEndpoint('holdings', holdingPid) };
        if (holdingData.metadata.patterns.frequency === 'rdafr:1016') {  // 'rdafr:1016 --> 'irregular frequency'
          record.issue.regular = false;
        }
      }
    );
  }
}
