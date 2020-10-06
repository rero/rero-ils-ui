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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult, RecordSearchComponent, RecordSearchService, RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-document-record-search',
  templateUrl: './document-record-search.component.html'
})
export class DocumentRecordSearchComponent extends RecordSearchComponent implements OnInit {

  /** Base url */
  private _baseUrl: string;

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
      && ('organisation' in this._route.snapshot.queryParams);
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
   * @param _recordSearchService - RecordSearchService
   * @param _recordService - RecordService
   */
  constructor(
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _recordSearchService: RecordSearchService,
    private _recordService: RecordService
  ) {
    super(_route, _router, _recordSearchService);
  }

  /** Init */
  ngOnInit() {
    super.ngOnInit();
    this._baseUrl = super.getCurrentUrl(this._documentType);
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

  /**
   * Launches a new documents search on all records
   * @param event - Click on link
   */
  linkToGlobalDocuments(event: any) {
    event.preventDefault();
    const queryParams = this._route.snapshot.queryParams;
    this._router.navigate(
      [this._baseUrl],
      { relativeTo: this._route, queryParams: {
        q: queryParams.q || '',
        page: 1,
        size: queryParams.size || 10
      }}
    );
  }
}
