// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Routes } from '@angular/router';
import { ItemSwitchLocationComponent } from '@app/admin/components/items/switch-location/item-switch-location/item-switch-location.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ComponentCanDeactivateGuard,
  EditorComponent,
  IFilter,
  JSONSchema7,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { IssueItemStatus, PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ItemType } from '../classes/items';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { ItemsBriefViewComponent } from '../record/brief-view/items-brief-view/items-brief-view.component';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { ItemPageDetailComponent } from '../record/detail-view/item-detail-view/item-page-detail/item-page-detail.component';
import { BaseRoute } from './base-route';

export const itemsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new ItemsRoute().getTypes();

export const itemsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Items'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.ITEM_ACCESS, PERMISSIONS.ITEM_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: ItemPageDetailComponent,
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Item'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'switch_location/:pid',
    component: ItemSwitchLocationComponent,
    title: _('Item'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Item'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.HOLD_CREATE, PERMISSIONS.ITEM_CREATE],
      permissionsOperator: PERMISSION_OPERATOR.AND,
    },
  },
];

class ItemsRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'items';

  /** Record type */
  readonly recordType = 'items';

  getTypes(): Partial<RecordType>[] {
    const types: Partial<RecordType>[] = [
      {
        key: this.name,
        label: 'Items',
        editorSettings: {
          longMode: true,
          template: {
            recordType: 'templates',
            loadFromTemplate: true,
            saveAsTemplate: true,
          },
        } as any,
        component: ItemsBriefViewComponent,
        detailComponent: ItemDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        preFilters: {
          organisation: null,
        },
        canRead: (record: RecordData) => this.canRead(record),
        canAdd: () => of({ can: false, message: '' }),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType, false),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
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
              ),
            };
          }
          return data;
        },
        preUpdateRecord: (data: any) => {
          // remove dynamic field
          if (Object.hasOwn(data, 'available')) {
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
          if (!Object.hasOwn(record, 'acquisition_date') && record.acquisition_date == null) {
            delete record.acquisition_date;
          }
          return record;
        },
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          return this._populateLocationsByCurrentUserLibrary(field, jsonSchema);
        }) as any,
        redirectUrl: (record: RecordData) => this.getUrl(record),
        aggregationsBucketSize: 10,
        aggregationsOrder: [
          'document_type',
          'library',
          'location',
          'item_type',
          'temporary_location',
          'temporary_item_type',
          'status',
          'current_requests',
        ],
        aggregationsExpand: ['document_type', 'library', 'location'],
        itemHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        listHeaders: {
          Accept: 'application/rero+json, application/json',
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
            defaultQuery: true,
            icon: 'fa fa-sort-amount-desc',
          },
          {
            label: _('Barcode'),
            value: 'barcode',
            icon: 'fa fa-sort-alpha-asc',
          },
          {
            label: _('Barcode (desc)'),
            value: '-barcode',
            icon: 'fa fa-sort-alpha-desc',
          },
          {
            label: _('Call number'),
            value: 'call_number',
            icon: 'fa fa-sort-alpha-asc',
          },
          {
            label: _('Call number (desc)'),
            value: '-call_number',
            icon: 'fa fa-sort-alpha-desc',
          },
          {
            label: _('Second call number'),
            value: 'second_call_number',
            icon: 'fa fa-sort-alpha-asc',
          },
          {
            label: _('Second call number (desc)'),
            value: '-second_call_number',
            icon: 'fa fa-sort-alpha-desc',
          },
          {
            label: _('Current requests'),
            value: 'current_requests',
            icon: 'fa fa-sort-amount-desc',
          },
        ],
      },
    ];

    // TODO: Refactor this after the change of AppInitializer service with user.
    toObservable(this.routeToolService.appStore.user, { injector: this.routeToolService.injector })
      .pipe(filter(u => !!u), take(1)).subscribe(() => {
        const { patronLibrarian } = this.routeToolService.appStore.user();
        if (patronLibrarian) {
          (types[0] as any).preFilters.organisation = patronLibrarian.organisation.pid;
        }
      });

    return types;
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
    return redirectTo ? of(redirectTo) : this.redirectUrl(record.metadata.document, '/records/documents/detail');
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
          const apiService: any = this.routeToolService.apiService;
          const recordService: RecordService = this.routeToolService.recordService as RecordService;
          const libraryPid = this.routeToolService.appStore.currentLibraryPid();
          const query = `library.pid:${libraryPid}`;
          f.props!.options = recordService
            .getRecords('locations', { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: 'name' })
            .pipe(
              map((result: any) => (+recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits)),
              map((hits: any[]) =>
                hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint('locations', hit.metadata.pid),
                  };
                })
              )
            );
        },
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
    record.issue.regular = true; // default to true

    // setting irregular issue from url parameter
    try {
      // NOTE : Using `Boolean(JSON.parse(...`, values [1, '1', 'true', 'True'] from url will be considered as True.
      const isIrregular = Boolean(JSON.parse(this.routeToolService.getRouteQueryParam('irregular', 'false')));
      if (isIrregular) {
        record.issue.regular = false;
      }
    } catch (_e) {
      /* intentional */
    }
    // setting other issue attributes from url parameters
    const today = this.routeToolService.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    record.enumerationAndChronology = this.routeToolService.getRouteQueryParam('enumerationAndChronology', '');
    record.issue.expected_date = this.routeToolService.getRouteQueryParam('expected_date', today);
    record.issue.received_date = this.routeToolService.getRouteQueryParam('received_date', today);

    (this.routeToolService.recordService as RecordService).getRecord('holdings', holdingPid).subscribe(
      (holdingData: any) => {
        record.item_type = holdingData.metadata.circulation_category;
        record.location = holdingData.metadata.location;
        record.document = holdingData.metadata.document;
        record.holding = { $ref: (this.routeToolService.apiService as any).getRefEndpoint('holdings', holdingPid) };
      }
    );
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'item_type':
      case 'temporary_item_type': return this.recordService.getRecord<{metadata: {name: string}}>('item_types', filter.key).pipe(map(record => record.metadata.name));
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      case 'location':
      case 'temporary_location': return this.recordService.getRecord<{metadata: {name: string}}>('locations', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
