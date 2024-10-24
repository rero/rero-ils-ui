/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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

import { Component, inject, OnInit } from '@angular/core';
import { RecordSearchPageComponent, RecordService, SearchResult } from '@rero/ng-core';
import { AppSettingsService } from '@rero/shared';

@Component({
  selector: 'admin-document-record-search',
  templateUrl: './document-record-search.component.html'
})
export class DocumentRecordSearchComponent extends RecordSearchPageComponent implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private appSettingsService: AppSettingsService = inject(AppSettingsService);

  /** Base url */
  private _baseUrl: string;

  /** Result of Elasticsearch */
  private searchResult: SearchResult;

  /** Resource type */
  private documentType = 'documents';

  /**
   * Show link for no result
   * @return boolean
   */
  get showLink(): boolean {
    return this.total === 0
      && ('organisation' in this.route.snapshot.queryParams)
      && this.route.snapshot.queryParams.q;
  }

  /**
   * Total number of records
   * @return null or number
   */
  get total(): null | number {
    if (this.searchResult) {
      return this.recordService.totalHits(
        this.searchResult.records.hits.total
      );
    }
    return null;
  }

  /**
   * Advanced search button displayed
   * according to configuration
   * @return boolean
   */
  get isAdvancedSearchEnable(): boolean {
    return this.appSettingsService.settings.documentAdvancedSearch;
  }

  /** Init */
  ngOnInit() {
    super.ngOnInit();
    this._baseUrl = super.getCurrentUrl(this.documentType);
  }

  /**
   * Result of search with type and records (Elasticsearch)
   * @param event - SearchResult
   */
  recordsSearched(event: SearchResult) {
    if (event && event.type === this.documentType) {
      this.searchResult = event;
    }
  }

  /**
   * Launches a new documents search on all records
   * @param event - Click on link
   */
  linkToGlobalDocuments(event: any) {
    event.preventDefault();
    const {queryParams} = this.route.snapshot;
    this.router.navigate(
      [this._baseUrl],
      { relativeTo: this.route, queryParams: {
        q: queryParams.q || '',
        page: 1,
        size: queryParams.size || 10,
        simple: this.recordSearchService.hasFilter('simple', '1') ? '1' : '0'
      }}
    );
  }

  /**
   * The advanced search query has changed
   * @param queryString - Query from the advanced search component
   */
  changedQueryString(queryString: string): void {
    const {queryParams} = this.route.snapshot;
    this.page = +queryParams.page || 1;
    this.size = +queryParams.size || 10;
    this.sort = queryParams.sort || 'bestmatch';
    this.q = queryString;
  }
}
