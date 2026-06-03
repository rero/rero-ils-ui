/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { _, TranslateService } from '@ngx-translate/core';
import { Bucket, capitalize, IFilter, RecordService, RecordType } from '@rero/ng-core';
import { EntityBriefViewComponent } from '@rero/shared';
import { AppConfigService } from '../app-config.service';
import { DocumentBriefComponent } from '../document-brief/document-brief.component';
import { DocumentRecordSearchComponent } from '../document-record-search/document-record-search.component';
import { map, Observable, of } from 'rxjs';

export const documentsRouteTitle: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const title = route.params['type'] === 'documents' ? _('Documents') : _('Authors/Subjects');
  return capitalize(title);
};

export const documentsRouteResolver: ResolveFn<Partial<RecordType>[]> = (route: ActivatedRouteSnapshot) => {
  const viewcode = route.params['viewcode'];
  return new DocumentsRoute(inject(AppConfigService), inject(ActivatedRoute), inject(TranslateService), inject(RecordService)).getTypes(viewcode);
};

export const documentsRoutes: Routes = [
  {
    path: '',
    title: documentsRouteTitle,
    component: DocumentRecordSearchComponent
  },
];

class DocumentsRoute {
  constructor(
    private appConfigService: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private recordService: RecordService,
  ) {}

  getTypes(viewcode: string): Partial<RecordType>[] {
    return [
      {
        key: 'documents',
        component: DocumentBriefComponent,
        label: _('Documents'),
        aggregationsName: {
          online: _('Online resources'),
          not_online: _('Physical resources'),
          organisation: _('Library'),
          genreForm: _('Genre, form'),
          intendedAudience: _('Intended audience'),
          acquisition: _('Acquisition date'),
          year: _('Publication year'),
          subject: _('Subject'),
          fiction_statement: _('Fiction statement'),
        },
        showFacetsIfNoResults: true,
        aggregationsOrder: this.aggregationsOrder(viewcode),
        aggregationsExpand: () => {
          const expand = ['document_type', 'fiction_statement'];
          const { queryParams } = this.activatedRoute.snapshot;
          if (this.appConfigService.globalViewName === viewcode) {
            if (queryParams['location'] || queryParams['library']) {
              expand.push('organisation');
            }
          } else if (queryParams['location']) {
            expand.push('library');
          }
          return expand;
        },
        aggregationsBucketSize: 10,
        searchFilters: [
          {
            label: _('Search in full text'),
            filter: 'fulltext',
            value: 'true',
          },
          {
            label: _('Show only:'),
            filters: [
              {
                label: _('Online resources'),
                filter: 'online',
                value: 'true',
              },
              {
                label: _('Physical resources'),
                filter: 'not_online',
                value: 'true',
              },
            ],
          },
        ],
        processBucketName: (bucket: Bucket) => this.processBucketName(bucket),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
        preFilters: {
          view: viewcode,
          simple: '1',
        },
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        exportFormats: [
          { label: 'JSON', format: 'raw', endpoint: '', disableMaxRestResultsSize: false },
          { label: 'RIS (Zotero...)', format: 'ris', endpoint: '', disableMaxRestResultsSize: false },
        ],
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
            defaultNoQuery: true,
          },
        ],
      },
      {
        key: 'entities',
        index: 'entities',
        component: EntityBriefViewComponent,
        label: _('Authors/Subjects'),
        aggregationsOrder: ['type'],
        aggregationsExpand: ['type'],
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        preFilters: {
          view: viewcode,
          simple: '1',
        },
      },
    ];
  }
private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'language': return this.translateService.stream(`lang_${filter.key}`);
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      case 'location': return this.recordService.getRecord<{metadata: {name: string}}>('locations', filter.key).pipe(map(record => record.metadata.name));
      case 'organisation': return this.recordService.getRecord<{metadata: {name: string}}>('organisations', filter.key).pipe(map(record => record.metadata.name));
      default: return this.translateService.stream(filter.key);
    }
  }

  private processBucketName(bucket: Bucket): Observable<string> {
    if(bucket.name) { return of(bucket.name); }
    switch (bucket.aggregationKey) {
      case 'language': return this.translateService.stream(`lang_${bucket.key}`);
      default: return this.translateService.stream(bucket.key);
    }
  }

  private aggregationsOrder(viewcode: string): string[] {
    const base = [
      'document_type',
      'fiction_statement',
      'language',
      'year',
      'author',
      'subject',
      'genreForm',
      'intendedAudience',
      'acquisition',
      'status',
    ];
    const location = this.appConfigService.globalViewName === viewcode ? 'organisation' : 'library';
    return [base[0], base[1], location, ...base.slice(2)];
  }
}
