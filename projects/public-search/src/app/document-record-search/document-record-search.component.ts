/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
 * Copyright (C) 2020-2023 UCLouvain
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { RecordSearchPageComponent, RecordSearchService, RecordService, RecordUiService, SearchResult } from '@rero/ng-core';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'public-search-document-record-search',
  templateUrl: './document-record-search.component.html'
})
export class DocumentRecordSearchComponent extends RecordSearchPageComponent implements OnInit {

  uriGlobalView: string;

  /** View code */
  private _viewCode: string;

  /** Result of Elasticsearch */
  private _searchResult: SearchResult;

  /** Resource type */
  private _documentType = 'documents';

  /**
   * Show link for no result
   * @return boolean
   */
  get showLink(): boolean {
    return this.total === 0
      && (this._appConfigService.globalViewName !== this._viewCode);
  }

  /**
   * Total number of records
   * @return null or number
   */
  get total(): null | number {
    if (this._searchResult) {
      return this._recordService.totalHits(
        this._searchResult.records.hits.total
      );
    }
    return null;
  }

  /**
   * Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _recordUiService - RecordUiService
   * @param _recordSearchService - RecordSearchService
   * @param _recordService - RecordService
   * @param _appConfigService - AppConfigService
   * @param _urlSerializer - UrlSerializer
   */
  constructor(
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _recordUiService: RecordUiService,
    protected _recordSearchService: RecordSearchService,
    private _recordService: RecordService,
    private _appConfigService: AppConfigService,
    private _urlSerializer: UrlSerializer
  ) {
    super(_route, _router, _recordSearchService, _recordUiService);
  }

  /** Init */
  ngOnInit() {
    super.ngOnInit();
    this.uriGlobalView = this._convertUrlForGlobalView();
  }

  /**
   * Result of search with type and records (Elasticsearch)
   * @param event - SearchResult
   */
  recordsSearched(event: SearchResult) {
    if (event && event.type === this._documentType) {
      this._searchResult = event;
    }
  }

  /** Convert url for global view redirect */
  private _convertUrlForGlobalView() {
    const { queryParams } = this._route.snapshot;
    const segments = this._router.parseUrl(this._router.url)
      .root.children.primary.segments.map(it => it.path);
    this._viewCode = segments[0];
    segments[0] = this._appConfigService.globalViewName;
    const baseUri = '/' + segments.join('/');
    const tree = this._router.createUrlTree([baseUri], { queryParams });
    return this._urlSerializer.serialize(tree);
  }
}
