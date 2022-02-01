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

import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, RouteInterface } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { DocumentRecordSearchComponent } from '../record/document-record-search/document-record-search.component';
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
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: DocumentRecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: DocumentEditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: DocumentEditorComponent },
        { path: 'duplicate', component: DocumentEditorComponent }
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
              this.expertSearchFilter()
            ],
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              record = this.removeKey(record, '_text');
              record = this.removeKey(record, '_draft');
              return record;
            },
            aggregations: (aggregations: any) => this._routeToolService
              .aggregationFilter(aggregations),
            aggregationsName: {
              organisation: _('Library')
            },
            allowEmptySearch: false,
            aggregationsOrder: [
              'document_type',
              'author',
              'organisation',
              'language',
              'subject',
              'status'
            ],
            aggregationsExpand: ['document_type'],
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
  }
}
