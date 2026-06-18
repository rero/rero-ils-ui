// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import type { EsResult } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private recordService: RecordService = inject(RecordService);

  /** Resource name */
  static readonly resource = 'libraries';

  /**
   * Library count
   * @return Observable
   */
  get count$() {
    return this.recordService.getRecords(
      LibraryService.resource,
      { page: 1, itemsPerPage: 1 }
    ).pipe(
      map((results: EsResult) => this.recordService.totalHits(results.hits.total))
    );
  }

  /**
   * Get Library
   * @param pid - Library pid
   * @return Observable
   */
  get$(pid: string) {
    return this.recordService.getRecord(LibraryService.resource, pid);
  }

  /**
   * Find all order by column name
   * @param order - string, order name
   * @return Observable
   */
  findAllOrderBy$(order = 'name') {
    return this._query(undefined, order);
  }

  /**
   * Find libraries by Pid and order by column name
   * @param pids array of string
   * @param order - string, order name
   * @return Observable
   */
  findByLibrariesPidAndOrderBy$(pids: string[], order = 'name') {
    return this._query('pid:' + pids.join(' OR pid:'), order);
  }

  /**
   * Query
   * @param query - any
   * @param order - string, order name
   */
  private _query(query: any, order = 'name') {
    return this.recordService.getRecords(
      LibraryService.resource,
      { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: order }
    );
  }
}
