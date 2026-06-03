/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  JSONSchema7,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { ILibrary, IPatron, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { CollectionBriefViewComponent } from '../record/brief-view/collection-brief-view.component';
import { CollectionDetailViewComponent } from '../record/detail-view/collection-detail-view/collection-detail-view.component';
import { BaseRoute } from './base-route';

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface JSONSchema7Items extends JSONSchema7 {
  items: {
    properties: any;
  };
}

export const collectionsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new CollectionsRoute().getTypes();

export const collectionsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    canActivate: [permissionGuard],
    title: _('Exhibitions/Courses'),
    data: {
      permissions: [PERMISSIONS.COLL_ACCESS, PERMISSIONS.COLL_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Exhibition/course'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Exhibition/course'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Exhibition/course'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.COLL_CREATE],
    },
  },
];

class CollectionsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'collections';

  /** Record type */
  readonly recordType = 'collections';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: 'Exhibition/course',
        component: CollectionBriefViewComponent,
        detailComponent: CollectionDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.COLL_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        aggregationsOrder: ['type', 'library', 'teacher', 'subject'],
        aggregationsExpand: ['type'],
        preprocessRecordEditor: (record: any) => {
          if (!record.pid) {
            // set the user's default library at the time of creation
            record.libraries = [];
            record.libraries.push({
              $ref: this.routeToolService.apiService.getRefEndpoint('libraries', this.routeToolService.appStore.currentLibraryPid()),
            });
          }
          return record;
        },
        preCreateRecord: (data) => {
          data.organisation = {
            $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
          };
          return data;
        },
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7Items): FormlyFieldConfig => {
          const formWidget = jsonSchema.widget;
          if (formWidget?.formlyConfig?.props?.fieldMap) {
            switch (formWidget.formlyConfig.props.fieldMap) {
              case 'items': {
                // filter the linked items by the organisation of the current logged user
                const queryOptions = jsonSchema?.items?.properties?.$ref?.widget?.formlyConfig?.props?.queryOptions;
                if (queryOptions) {
                  const currentOrganisation = this.routeToolService.appStore.currentOrganisationPid();
                  queryOptions.filter = `AND organisation.pid:${currentOrganisation}`;
                }
                break;
              }
              case 'library':
                return this.populateLibrariesByCurrentUser(field);
            }
          }
          return field;
        }) as any,
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            defaultQuery: true,
          },
          {
            label: _('Title'),
            value: 'title',
            defaultNoQuery: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }

  /**
   * Populate select menu with libraries of current user library
   * @param field - FormlyFieldConfig
   * @return FormlyFieldConfig
   */
  private populateLibrariesByCurrentUser(field: FormlyFieldConfig): FormlyFieldConfig {
    field.type = 'select';
    field.hooks = {
      ...field.hooks,
      afterContentInit: (f: FormlyFieldConfig) => {
        const user = this.routeToolService.appStore.user();
        const apiService: any = this.routeToolService.apiService;
        const recordService: RecordService = this.routeToolService.recordService as RecordService;

        // Extract libraries from patron > libraries
        const libraries = [];
        user?.patrons.map((patron: IPatron) => {
          patron.libraries.map((library: ILibrary) => {
            libraries.push(library.pid);
          });
        });

        f.props.options = recordService
          .getRecords('libraries', {
            query: `pid:${libraries.join(' OR pid:')}`,
            page: 1,
            itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
            sort: 'name',
          })
          .pipe(
            map((result: any) => (+recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits)),
            map((hits: any) => {
              return hits.map((hit: any) => {
                return {
                  label: hit.metadata.name,
                  value: apiService.getRefEndpoint('libraries', hit.metadata.pid),
                };
              });
            })
          );
      },
    };
    return field;
  }
}
