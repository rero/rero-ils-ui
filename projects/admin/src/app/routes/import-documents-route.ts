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

import { TranslateService } from '@ngx-translate/core';
import { RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { ImportSourceApiService } from '../api/import-source-api.service';
import { ExternalSourceSetting } from '../classes/external-source';
import { PermissionGuard } from '../guard/permission.guard';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { DocumentDetailComponent } from '../record/detail-view/document-detail-view/document-detail/document-detail.component';
import { BaseRoute } from './base-route';
import { RouteToolService } from './route-tool.service';
import { inject } from '@angular/core';

export class ImportDocumentsRoute extends BaseRoute implements RouteInterface {

  private translateService: TranslateService = inject(TranslateService);

  /** Route name */
  readonly name = 'import';

  private _baseTypeConfig = {
    component: DocumentsBriefViewComponent,
    detailComponent: DocumentDetailViewComponent,
    canAdd: () => of(false),
    canUpdate: () => of(false),
    canDelete: () => of(false),
    resultsText: (hits: any) => this.getResultsText(hits),
    aggregationsBucketSize: 10,
    aggregationsOrder: ['document_type', 'author', 'language', 'year'],
    aggregationsExpand: ['document_type', 'author', 'language', 'year'],
    itemHeaders: { Accept: 'application/rero+json, application/json'},
    listHeaders: { Accept: 'application/rero+json, application/json'},
    allowEmptySearch: false,
    showFacetsIfNoResults: true
  };

  /**
   * Get Configuration
   * @returns the configuration to use for this route
   */
  getConfiguration() {
    const config = {
      path: 'records/:type',
      children: [
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.DOC_ACCESS, PERMISSIONS.DOC_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
        { path: 'detail/:pid', component: DocumentDetailComponent }
      ],
      data: {
        types: []
      }
    };
    this.routeToolService.injector.get(ImportSourceApiService)
      .getSources()
      .subscribe((sources: Array<ExternalSourceSetting>) => {
        sources.forEach((source: ExternalSourceSetting) => {
          const sourceConfig = this._loadConfigSource(source);
          config.data.types.push(sourceConfig);
        });
      });
    return config;
  }

  /**
   * Get the string used to display the search result number.
   * @param hits - list of hit results.
   * @returns observable of the string representation of the number of results.
   */
  getResultsText(hits: any): Observable<string> {
    const total = this.routeToolService.recordService.totalHits(hits.total) || 0;
    return (total === 0)
      ? this.translateService.stream('no result')
      : this.translateService.stream('{{ total }} results of {{ remoteTotal }}', {
          total, remoteTotal: hits.remote_total
        });
  }

  /**
   * Allow to build the external source configuration
   * @param source - the source to analyze
   */
  private _loadConfigSource(source: ExternalSourceSetting) {
    const sourceConfig = {
      key: source.getImportEndpoint(),
      label: source.label
    };
    return {...this._baseTypeConfig, ...sourceConfig};
  }
}
