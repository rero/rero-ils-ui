/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { Component, inject, OnInit } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { RecordSearchPageComponent, RecordService, SearchResult } from '@rero/ng-core';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'public-search-document-record-search',
  templateUrl: './document-record-search.component.html'
})
export class DocumentRecordSearchComponent extends RecordSearchPageComponent implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private appConfigService: AppConfigService = inject(AppConfigService);
  private urlSerializer: UrlSerializer = inject(UrlSerializer);

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
      && (this.appConfigService.globalViewName !== this._viewCode);
  }

  /**
   * Total number of records
   * @return null or number
   */
  get total(): null | number {
    if (this._searchResult) {
      return this.recordService.totalHits(
        this._searchResult.records.hits.total
      );
    }
    return null;
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
    const { queryParams } = this.route.snapshot;
    const segments = this.router.parseUrl(this.router.url)
      .root.children.primary.segments.map(it => it.path);
    this._viewCode = segments[0];
    segments[0] = this.appConfigService.globalViewName;
    const baseUri = '/' + segments.join('/');
    const tree = this.router.createUrlTree([baseUri], { queryParams });
    return this.urlSerializer.serialize(tree);
  }
}
