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

import { TranslateService } from '@ngx-translate/core';
import { DetailComponent, RecordSearchComponent, RouteInterface } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { BaseRoute } from './base-route';
import { RouteToolService } from './route-tool.service';

export class ImportDocumentsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'import';

  /**
   * Constructor
   * @param routeToolService - RouteToolService for the parent class.
   * @param _translateService - TranslateService to translate the number of results.
   */
  constructor(
    protected _routeToolService: RouteToolService,
    private _translateService: TranslateService
  ) {
    super(_routeToolService);
  }

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      path: 'records/:type',
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent }
      ],
      data: {
        types: [
          {
            key: 'import_bnf',
            label: 'BNF Importation',
            component: DocumentsBriefViewComponent,
            detailComponent: DocumentDetailViewComponent,
            canAdd: () => of(false),
            canUpdate: () => of(false),
            canDelete: () => of(false),
            resultsText: (hits: any) => this.getResultsText(hits),
            aggregationsBucketSize: 10,
            aggregationsOrder: [
              'type',
              'author',
              'year'
            ],
            aggregationsExpand: ['type', 'author', 'year'],
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            }
          }
        ]
      }
    };
  }
  /**
   *
   * @param hits list of hit results.
   * @return observable of the string representation of the number of results.
   */
  getResultsText(hits: any): Observable<string> {
    const total = this._routeToolService.recordService.totalHits(hits.total);
    if (total === 0) {
      return this._translateService.stream('no result');
    }
    return this._translateService.stream('{{ total }} results of {{ remoteTotal }}',
      {
        total,
        remoteTotal: hits.remote_total
      }
    );
  }
}
