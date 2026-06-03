/*
 * RERO ILS UI
 * Copyright (C) 2023-2025 RERO
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
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import type { ActionStatus, EsResult, IFilter } from '@rero/ng-core';
import {
  DetailComponent,
  EditorComponent,
  JSONSchema7,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { StatisticsCfgBriefViewComponent } from '../record/brief-view/statistics-cfg-brief-view-component';
import { StatisticsCfgDetailViewComponent } from '../record/detail-view/statistics-cfg-detail-view/statistics-cfg-detail-view.component';
import { BaseRoute } from './base-route';

export const statisticsCfgRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new StatisticsCfgRoute().getTypes();

export const statisticsCfgRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Report configurations'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.STAT_CFG_ACCESS, PERMISSIONS.STAT_CFG_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Report configuration'),
    canActivate: [canAccessGuard],
    data: { action: CAN_ACCESS_ACTIONS.READ },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Report configuration'),
    canActivate: [canAccessGuard],
    data: { action: CAN_ACCESS_ACTIONS.UPDATE },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Report configuration'),
    canActivate: [permissionGuard],
    data: { permissions: [PERMISSIONS.STAT_CFG_CREATE] },
  },
];

class StatisticsCfgRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'stats_cfg';

  /** Record type */
  readonly recordType = 'stats_cfg';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Statistics configuration'),
        editorSettings: {
          longMode: false,
        },
        component: StatisticsCfgBriefViewComponent,
        detailComponent: StatisticsCfgDetailViewComponent,
        aggregationsBucketSize: 10,
        aggregationsExpand: ['library', 'category', 'frequency'],
        aggregationsOrder: ['library', 'category', 'frequency'],
        showFacetsIfNoResults: true,
        searchFilters: [
          this.expertSearchFilter(),
          {
            label: _('Active Only'),
            filter: 'active',
            value: 'true',
          },
        ],
        listHeaders: {
          Accept: 'application/rero+json',
        },
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.STAT_CFG_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          return this._populateLocationsByCurrentUserLibrary(field, jsonSchema);
        }) as any,
        preCreateRecord: (data) => {
          data.library = {
            $ref: this.routeToolService.apiService.getRefEndpoint('libraries', this.routeToolService.appStore.currentLibraryPid()),
          };
          return data;
        },
      },
    ];
  }

  /**
   * Populate select menu with the current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _populateLocationsByCurrentUserLibrary(
    field: FormlyFieldConfig,
    jsonSchema: JSONSchema7
  ): FormlyFieldConfig {
    const formWidget = jsonSchema.widget;
    if (formWidget?.formlyConfig?.props?.fieldMap === 'libraries') {
      field.type = 'select';
      field.hooks = {
        ...field.hooks,
        onInit: (field: FormlyFieldConfig): void => {
          const baseUrl = this.routeToolService.appStore.settings()?.baseUrl;
          const prefix = this.routeToolService.apiService.getEndpointByType('libraries');
          const currentLibraryPid = this.routeToolService.appStore.currentLibraryPid();
          if (currentLibraryPid != null && field.formControl.value == null) {
            field.formControl.setValue(`${baseUrl}${prefix}/${currentLibraryPid}`);
          }
        },
        afterContentInit: (f: FormlyFieldConfig) => {
          const { apiService, recordService } = this.routeToolService;
          f.props.options = recordService
            .getRecords('libraries', {
              query: '',
              page: 1,
              itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
              sort: 'name',
            })
            .pipe(
              map((result: EsResult) =>
                this.routeToolService.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits
              ),
              map((hits: any) =>
                hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint('libraries', hit.metadata.pid),
                  };
                })
              )
            );
        },
      };
    }
    return field;
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
