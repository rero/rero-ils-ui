// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { TranslateService, _ } from '@ngx-translate/core';
import { Bucket, IFilter, RecordType } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportSourceApiService } from '../api/import-source-api.service';
import { ExternalSourceSetting } from '../classes/external-source';
import { permissionGuard } from '../guard/permission.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { DocumentDetailComponent } from '../record/detail-view/document-detail-view/document-detail/document-detail.component';
import { ImportRecordSearchComponent } from '../record/search-view/import-record-search/import-record-search.component';
import { BaseRoute } from './base-route';

export const importDocumentsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new ImportDocumentsRoute().getTypeConfigs();

export const importDocumentsRoutes: Routes = [
  {
    path: '',
    component: ImportRecordSearchComponent,
    title: _('Import from the web'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.DOC_ACCESS, PERMISSIONS.DOC_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DocumentDetailComponent,
    title: _('Import'),
  },
];

class ImportDocumentsRoute extends BaseRoute {
  private translateService: TranslateService = inject(TranslateService);
  private importSourceApiService: ImportSourceApiService = inject(ImportSourceApiService);

  private _baseTypeConfig: any = {
    component: DocumentsBriefViewComponent,
    detailComponent: DocumentDetailViewComponent,
    canAdd: () => of(false),
    canUpdate: () => of(false),
    canDelete: () => of(false),
    processBucketName: (bucket: Bucket) => this.processName(bucket),
    processFilterName: (filter: IFilter) => this.processName(filter),
    resultsText: (hits: any) => this.getResultsText(hits),
    aggregationsBucketSize: 10,
    aggregationsOrder: ['document_type', 'author', 'language', 'year'],
    aggregationsExpand: ['document_type', 'author', 'language', 'year'],
    itemHeaders: { Accept: 'application/rero+json, application/json' },
    listHeaders: { Accept: 'application/rero+json, application/json' },
    allowEmptySearch: false,
    showFacetsIfNoResults: true,
  };

  /**
   * Get type configs from external sources (async).
   * @returns observable of the array of record type configurations.
   */
  getTypeConfigs(): Observable<Partial<RecordType>[]> {
    return this.importSourceApiService.getSources().pipe(
      map((sources: ExternalSourceSetting[]) => sources.map((source) => this._loadConfigSource(source)))
    );
  }

  /**
   * Get the string used to display the search result number.
   * @param hits - list of hit results.
   * @returns string representation of the number of results.
   */
  getResultsText(hits: any): string {
    const total = this.routeToolService.recordService.totalHits(hits.total) || 0;
    return total === 0
      ? this.translateService.instant('no result')
      : this.translateService.instant('{{ total }} results of {{ remoteTotal }}', {
          total,
          remoteTotal: hits.remote_total,
        });
  }

  /**
   * Allow to build the external source configuration
   * @param source - the source to analyze
   */
  private _loadConfigSource(source: ExternalSourceSetting) {
    const sourceConfig = {
      key: source.getImportEndpoint(),
      label: source.label,
    };
    return { ...this._baseTypeConfig, ...sourceConfig };
  }

  /**
   * Process bucket or filter name.
   *
   * @param bucketOrFilter Bucket or filter.
   * @return Observable of the name.
   */
  private processName(bucketOrFilter: Bucket | IFilter): Observable<string> {
    if(bucketOrFilter.name) { return of(bucketOrFilter.name); }
    switch (bucketOrFilter.aggregationKey) {
      case 'language': return of(this.routeToolService.translateService.instant(`lang_${bucketOrFilter.key}`));
      default: return this.routeToolService.translateService.stream(bucketOrFilter.key);
    }
  }
}
