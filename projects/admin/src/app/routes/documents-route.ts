/*
 * RERO ILS UI
 * Copyright (C) 2020-2022 RERO
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
import { DetailComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { CanAccessGuard, CAN_ACCESS_ACTIONS } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
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
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: DocumentEditorComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: DocumentEditorComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.DOC_CREATE ] } },
        { path: 'duplicate', component: DocumentEditorComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.DOC_CREATE ] } }
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
                label: _('Online resources'),
                filter: 'online',
                value: 'true'
              },
              {
                label: _('Physical resources'),
                filter: 'not_online',
                value: 'true'
              }
            ],
            canAdd: () => of({ can: this._routeToolService.permissionsService.canAccess(PERMISSIONS.DOC_CREATE) }),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              record = this.removeKey(record, '_text');
              record = this.removeKey(record, '_draft');
              return record;
            },
            aggregations: (aggregations: any) => this._routeToolService
              .aggregationFilter(aggregations),
            aggregationsName: {
              online: _('Online resources'),
              not_online: _('Physical resources'),
              organisation: _('Library'),
              genreForm: _('Genre, form'),
              intendedAudience: _('Intended audience'),
              year: _('Publication year'),
              subject_fiction: _('Subject (fiction)'),
              subject_no_fiction: _('Subject (non-fiction)'),
            },
            showFacetsIfNoResults: true,
            allowEmptySearch: false,
            aggregationsOrder: [
              'document_type',
              'organisation',
              'language',
              'year',
              'author',
              'subject_no_fiction',
              'subject_fiction',
              'genreForm',
              'intendedAudience',
              'status'
            ],
            aggregationsExpand: () => {
              const expand = ['document_type'];
              const queryParams = this._routeToolService.activatedRoute.snapshot.queryParams;
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
                this._routeToolService.translateService.instant('Do you really want to delete this record?'),
                this._routeToolService.translateService.instant('This will also delete all items and issues of the holdings.')
              ]);
            },
            hideInTabs: true
          }
        ]
      }
    };

    this._routeToolService.organisationService.onOrganisationLoaded$.subscribe((org) => {
      config.data.types[0]['defaultSearchInputFilters'] = [{
        'key': 'organisation', 'values': [org.pid]
      }];
    });
    return config;
  }
}
