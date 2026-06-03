/*
 * RERO ILS UI
 * Copyright (C) 2020-2026 RERO
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
import { _ } from '@ngx-translate/core';
import { Bucket, ComponentCanDeactivateGuard, IFilter, RecordData, RecordService, RecordType } from '@rero/ng-core';
import { AppStore, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { map, Observable, of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { DocumentDetailComponent } from '../record/detail-view/document-detail-view/document-detail/document-detail.component';
import { DocumentRecordSearchComponent } from '../record/search-view/document-record-search/document-record-search.component';
import { BaseRoute } from './base-route';

export const documentsRouteResolver: ResolveFn<Partial<RecordType>[]> = () => {
  return new DocumentsRoute().getTypesForOrg();
};

export const documentsRoutes: Routes = [
  {
    path: '',
    component: DocumentRecordSearchComponent,
    title: _('Documents'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.DOC_ACCESS, PERMISSIONS.DOC_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DocumentDetailComponent,
    title: _('Document'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: DocumentEditorComponent,
    title: _('Document'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: DocumentEditorComponent,
    title: _('Document'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.DOC_CREATE],
    },
  },
  {
    path: 'duplicate',
    component: DocumentEditorComponent,
    title: _('Document'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.DOC_CREATE],
    },
  },
];

class DocumentsRoute extends BaseRoute {
  protected recordService = inject(RecordService);
  protected appStore = inject(AppStore);

  /** Route name */
  readonly name = 'documents';

  /** Record type */
  readonly recordType = 'documents';

  getTypesForOrg(): Partial<RecordType>[] {
    const docType = {
      key: this.name,
      label: _('Documents'),
      editorSettings: {
        longMode: true,
        template: {
          recordType: 'templates',
          loadFromTemplate: true,
          saveAsTemplate: true,
        },
      },
      component: DocumentsBriefViewComponent,
      detailComponent: DocumentDetailViewComponent,
      searchFilters: [
        this.expertSearchFilter(),
        {
          label: _('Search in full text'),
          filter: 'fulltext',
          value: 'true',
          showIfQuery: true,
        },
        {
          label: _('Show only:'),
          filters: [
            {
              label: _('Online resources'),
              filter: 'online',
              value: 'true',
              showIfQuery: true,
            },
            {
              label: _('Physical resources'),
              filter: 'not_online',
              value: 'true',
              showIfQuery: true,
            },
          ],
        },
      ],
      canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.DOC_CREATE), message: '' }),
      permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
      processBucketName: (bucket: Bucket) => this.processBucketName(bucket),
      processFilterName: (filter: IFilter) => this.processFilterName(filter),
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
              delete contribution.entity.type;
            }
          });
        }
        return record;
      },
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
        Accept: 'application/rero+json, application/json',
      },
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
          label: _('Date (newest)'),
          value: 'pub_date_new',
        },
        {
          label: _('Date (oldest)'),
          value: 'pub_date_old',
        },
        {
          label: _('Title'),
          value: 'title',
        },
      ],
    };

    const types: Partial<RecordType>[] = [
      docType,
      {
        key: 'holdings',
        deleteMessage: (): string[] => {
          return [
            this.routeToolService.translateService.instant(_('Do you really want to delete this record?')),
            this.routeToolService.translateService.instant(
              _('This will also delete all items and issues of the holdings.')
            ),
          ];
        },
        hideInTabs: true,
      },
      // Required for saving templates in the document editor
      {
        key: 'templates',
        preCreateRecord: (data) => this._addDefaultValuesForTemplate(data),
        redirectUrl: (record: RecordData) => {
          return this.redirectUrl(record.metadata, '/records/templates/detail');
        },
        hideInTabs: true,
      }
    ];

    const organisationPid = this.appStore.organisation()?.pid;
    if (organisationPid) {
      types[0]['defaultSearchInputFilters'] = [{ key: 'organisation', values: [organisationPid] }];
    }
    return types;
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'language': return this.routeToolService.translateService.stream(`lang_${filter.key}`);
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      case 'location': return this.recordService.getRecord<{metadata: {name: string}}>('locations', filter.key).pipe(map(record => record.metadata.name));
      case 'organisation': return this.recordService.getRecord<{metadata: {name: string}}>('organisations', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }

  private processBucketName(bucket: Bucket): Observable<string> {
    if(bucket.name) { return of(bucket.name); }
    switch (bucket.aggregationKey) {
      case 'language': return this.routeToolService.translateService.stream(`lang_${bucket.key}`);
      default: return this.routeToolService.translateService.stream(bucket.key);
    }
  }

  private _addDefaultValuesForTemplate(data: any) {
    if (!Object.hasOwn(data, 'visibility')) {
      data.visibility = 'private';
    }
    data.organisation = {
      $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.appStore.currentOrganisationPid()),
    };
    data.creator = {
      $ref: this.routeToolService.apiService.getRefEndpoint('patrons', this.appStore.user().patronLibrarian.pid),
    };
    return data;
  }
}
