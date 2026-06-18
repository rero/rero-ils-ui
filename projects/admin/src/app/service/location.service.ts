// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { Error, RecordService } from '@rero/ng-core';
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
  getLocationsByLibraries$(libraryPids: string[]): Observable<any[]> {
    const query = libraryPids.map(pid => `library.pid:${pid}`).join(' OR ');
    return this._query(query).pipe(
      map((data: EsResult) => data.hits as any),
      map((hits: {hits: any[], total: any}) => +this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
    );
  }

  // PRIVATE SERVICE FUNCTIONS ================================================
  /**
   * Query location records
   * @param query: the query to use
   * @param options: options to use to get records.
   */
  private _query(query: string, options?: GetRecordsOptions): Observable<EsResult | Error> {
    options = {...LocationService.defaultOptions, ...options};
    return this.recordService.getRecords(
      LocationService.resource,
      {
        query,
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        aggregationsFilters: options.aggregations as any,
        preFilters: options.preFilters as any,
        headers: options.headers,
        sort: options.sort
      }
    );
  }
}


/** Options available to search records */
export type GetRecordsOptions = {
  page?: number,
  itemsPerPage?: number,
  aggregations?: string[],
  preFilters?: object,
  sort?: string,
  headers?: {
    Accept?: string
  }
}


