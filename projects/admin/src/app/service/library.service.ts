/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
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
      undefined,
      1,
      1
    ).pipe(
      map((results: Record) => this.recordService.totalHits(results.hits.total))
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
  findAllOrderBy$(order: string = 'name') {
    return this._query(undefined);
  }

  /**
   * Find libraries by Pid and order by column name
   * @param pids array of string
   * @param order - string, order name
   * @return Observable
   */
  findByLibrariesPidAndOrderBy$(pids: string[], order: string = 'name') {
    return this._query('pid:' + pids.join(' OR pid:'));
  }

  /**
   * Query
   * @param query - any
   * @param order - string, order name
   */
  private _query(query: any, order: string = 'name') {
    return this.recordService.getRecords(
      LibraryService.resource, query, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, order
    );
  }
}
