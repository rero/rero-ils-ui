/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { inject, Injectable } from '@angular/core';
import { Record, Error, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private recordService: RecordService = inject(RecordService);

  // SERVICE ATTRIBUTES =======================================================
  /** Resource name */
  static readonly resource = 'locations';

  /** Default option used to search about records. */
  static readonly defaultOptions: GetRecordsOptions = {
    page: 1,
    itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
    aggregations: [],
    preFilters: undefined,
    sort: 'name',
    headers: {
      Accept: 'application/rero+json'
    }
  };

  // SERVICE FUNCTIONS ========================================================
  /**
   * Get all locations related to some libraries
   * @param libraryPids: the library pids
   */
  getLocationsByLibraries$(libraryPids: Array<string>): Observable<Array<any>> {
    const query = libraryPids.map(pid => `library.pid:${pid}`).join(' OR ');
    return this._query(query).pipe(
      map((data: Record) => data.hits),
      map((hits: {hits: Array<any>, total:number}) => this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
    );
  }

  // PRIVATE SERVICE FUNCTIONS ================================================
  /**
   * Query location records
   * @param query: the query to use
   * @param options: options to use to get records.
   */
  private _query(query: string, options?: GetRecordsOptions): Observable<Record | Error> {
    options = {...LocationService.defaultOptions, ...options};
    return this.recordService.getRecords(
      LocationService.resource,
      query,
      options.page,
      options.itemsPerPage,
      options.aggregations,
      options.preFilters,
      options.headers,
      options.sort
    );
  }
}


/** Options available to search records */
export interface GetRecordsOptions {
  page?: number,
  itemsPerPage?: number,
  aggregations?: Array<string>,
  preFilters?: object,
  sort?: string,
  headers?: {
    Accept?: string
  }
}


