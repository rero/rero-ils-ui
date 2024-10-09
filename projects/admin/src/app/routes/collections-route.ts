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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  ComponentCanDeactivateGuard,
  DetailComponent, EditorComponent,
  JSONSchema7, Record, RecordSearchPageComponent, RecordService, RouteInterface
} from '@rero/ng-core';
import { ILibrary, IPatron, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { CollectionBriefViewComponent } from '../record/brief-view/collection-brief-view.component';
import { CollectionDetailViewComponent } from '../record/detail-view/collection-detail-view/collection-detail-view.component';
import { BaseRoute } from './base-route';

export class CollectionsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'collections';

  /** Record type */
  readonly recordType = 'collections';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.COLL_ACCESS, PERMISSIONS.COLL_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.COLL_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Exhibition/course',
            component: CollectionBriefViewComponent,
            detailComponent: CollectionDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.COLL_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            aggregationsOrder: ['type', 'library', 'teacher', 'subject'],
            aggregationsExpand: ['type'],
            preprocessRecordEditor: (record: any) => {
              const { user } = this.routeToolService.userService;
              if (!record.pid) {
                // set the user's default library at the time of creation
                record.libraries = [];
                record.libraries.push({
                  $ref: this.routeToolService.apiService.getRefEndpoint(
                    'libraries',
                    user.currentLibrary
                  )
                });
              }
              return record;
            },
            preCreateRecord: (data: any) => {
              const { user } = this.routeToolService.userService;
              data.organisation = {
                $ref: this.routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.currentOrganisation
                )
              };
              return data;
            },
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              const formWidget = jsonSchema.widget;
              if (formWidget?.formlyConfig?.props?.fieldMap) {
                switch (formWidget.formlyConfig.props.fieldMap) {
                  case 'library':
                    return this.populateLibrariesByCurrentUser(field);
                }
              }
              return field;
            },
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Title'),
                value: 'title',
                defaultNoQuery: true
              }
            ],
            showFacetsIfNoResults: true
          }
        ]
      }
    };
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
        const { user } = this.routeToolService.userService;
        const { apiService, recordService } = this.routeToolService;

        // Extract libraries from patron > libraries
        const libraries = [];
        user.patrons.map((patron: IPatron) => {
          patron.libraries.map((library: ILibrary) => {
            libraries.push(library.pid);
          });
        });

        f.props.options = recordService.getRecords(
          'libraries',
          `pid:${libraries.join(' OR pid:')}`, 1,
          RecordService.MAX_REST_RESULTS_SIZE,
          undefined,
          undefined,
          undefined,
          'name'
        ).pipe(
          map((result: Record) => result.hits.total === 0 ? [] : result.hits.hits),
          map((hits: any) => {
            return hits.map((hit: any) => {
              return {
                label: hit.metadata.name,
                value: apiService.getRefEndpoint(
                  'libraries',
                  hit.metadata.pid
                )
              };
            });
          })
        );
      }
    };
    return field;
  }
}
