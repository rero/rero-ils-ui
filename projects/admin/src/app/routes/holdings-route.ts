// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  JSONSchema7,
  RecordData,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { HoldingEditorComponent } from '../record/custom-editor/holding-editor/holding-editor.component';
import { HoldingDetailViewComponent } from '../record/detail-view/holding-detail-view/holding-detail-view.component';
import { HoldingPageDetailComponent } from '../record/detail-view/holding-detail-view/holding-page-detail/holding-page-detail.component';
import { BaseRoute } from './base-route';

export const holdingsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new HoldingsRoute().getTypes();

export const holdingsRoutes: Routes = [
  {
    path: 'detail/:pid',
    component: HoldingPageDetailComponent,
    title: _('Holdings'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: HoldingEditorComponent,
    title: _('Holding'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: HoldingEditorComponent,
    title: _('Holding'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.HOLD_CREATE],
    },
  },
];

class HoldingsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'holdings';

  /** Record type */
  readonly recordType = 'holdings';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: 'Holdings',
        editorSettings: {
          longMode: true,
          template: {
            recordType: 'templates',
            loadFromTemplate: true,
            saveAsTemplate: true,
          },
        },
        detailComponent: HoldingDetailViewComponent,
        canRead: (record: RecordData) => this.canRead(record),
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.HOLD_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType, true),
        preCreateRecord: (data) => {
          data.document = {
            $ref: this.routeToolService.apiService.getRefEndpoint(
              'documents',
              this.routeToolService.getRouteQueryParam('document')
            ),
          };
          return data;
        },
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          return this.populateLocationsByCurrentUserLibrary(field, jsonSchema);
        }) as any,
        deleteMessage: (): string[] => {
          return [
            this.routeToolService.translateService.instant(_('Do you really want to delete this record?')),
            this.routeToolService.translateService.instant(
              _('This will also delete all items and issues of the holdings.')
            ),
          ];
        },
        redirectUrl: (record: RecordData, action: string) => {
          switch (action) {
            case 'delete':
              return of(`/records/documents/detail/${(record.metadata.document as Record<string, string>).pid}`);
            default:
              return of(`/records/holdings/detail/${record.metadata.pid}`);
          }
        },
      },
    ];
  }

  /**
   * Populate select menu with locations of current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private populateLocationsByCurrentUserLibrary(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
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
              map((hits: any) => {
                return hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint('locations', hit.metadata.pid),
                  };
                });
              })
            );
        },
      };
    }
    return field;
  }
}
