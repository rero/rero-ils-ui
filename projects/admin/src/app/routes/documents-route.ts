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
import { ComponentCanDeactivateGuard, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { DocumentDetailComponent } from '../record/detail-view/document-detail-view/document-detail/document-detail.component';
import { DocumentRecordSearchComponent } from '../record/search-view/document-record-search/document-record-search.component';
import { BaseRoute } from './base-route';

export class DocumentsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'documents';

  /** Record type */
  readonly recordType = 'documents';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    const config = {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: DocumentRecordSearchComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.DOC_ACCESS, PERMISSIONS.DOC_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DocumentDetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: DocumentEditorComponent, canActivate: [ CanAccessGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: DocumentEditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.DOC_CREATE ] } },
        { path: 'duplicate', component: DocumentEditorComponent, canActivate: [ PermissionGuard ], canDeactivate: [ ComponentCanDeactivateGuard ], data: { permissions: [ PERMISSIONS.DOC_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Documents',
            editorSettings: {
              longMode: true,
              template: {
                recordType: 'templates',
                loadFromTemplate: true,
                saveAsTemplate: true
              }
            },
            component: DocumentsBriefViewComponent,
            detailComponent: DocumentDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter(),
              {
                filters:[
                  {
                    label: _('Search in full text'),
                    filter: 'fulltext',
                    value: 'true',
                    showIfQuery: true
                  }
                ]
              },
              {
                label: _('Show only:'),
                filters: [
                  {
                    label: _('Online resources'),
                    filter: 'online',
                    value: 'true',
                    showIfQuery: true
                  },
                  {
                    label: _('Physical resources'),
                    filter: 'not_online',
                    value: 'true',
                    showIfQuery: true
                  }
                ]
              },
            ],
            canAdd: () => of({ can: this.routeToolService.permissionsService.canAccess(PERMISSIONS.DOC_CREATE) }),
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              record = this.removeKey(record, '_text');
              record = this.removeKey(record, '_draft');
              return record;
            },
            postprocessRecordEditor: (record: any) => {
              // A linked entity must not have a type in the data.
              // If it does, we delete it.
              if (record.contribution) {
                record.contribution.map((contribution: any) => {
                  if (contribution.entity.$ref && contribution.entity.type) {
                    delete(contribution.entity.type);
                  }
                });
              }
              return record;
            },
            aggregations: (aggregations: any) => this.routeToolService
              .aggregationFilter(aggregations),
            aggregationsName: {
              online: _('Online resources'),
              not_online: _('Physical resources'),
              organisation: _('Library'),
              genreForm: _('Genre, form'),
              intendedAudience: _('Intended audience'),
              year: _('Publication year'),
              subject: _('Subject'),
              fiction_statement: _('Fiction statement'),
              acquisition: _('Acquisition date'),
            },
            showFacetsIfNoResults: true,
            allowEmptySearch: false,
            aggregationsOrder: [
              'document_type',
              'fiction_statement',
              'organisation',
              'language',
              'year',
              'author',
              'subject',
              'genreForm',
              'intendedAudience',
              'acquisition',
              'status',
            ],
            aggregationsExpand: () => {
              const expand = ['document_type', 'fiction_statement'];
              const { queryParams } = this.routeToolService.activatedRoute.snapshot;
              if (queryParams.location || queryParams.library) {
                expand.push('organisation');
              }
              return expand;
            },
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
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
                label: _('Date (newest)'),
                value: 'pub_date_new'
              },
              {
                label: _('Date (oldest)'),
                value: 'pub_date_old',
              },
                {
                  label: _('Title'),
                  value: 'title'
                }
            ]
          },
          {
            key: 'holdings',
            name: 'holdings',
            deleteMessage: (pid: string): Observable<string[]> => {
              return of([
                this.routeToolService.translateService.instant('Do you really want to delete this record?'),
                this.routeToolService.translateService.instant('This will also delete all items and issues of the holdings.')
              ]);
            },
            hideInTabs: true
          }
        ]
      }
    };

    this.routeToolService.organisationService.onOrganisationLoaded$.subscribe((org) => {
      config.data.types[0]['defaultSearchInputFilters'] = [{
        'key': 'organisation', 'values': [org.pid]
      }];
    });
    return config;
  }
}
