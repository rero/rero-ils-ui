/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  /** Resource name */
  static readonly resource = 'libraries';

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /**
   * Library count
   * @return Observable
   */
  get count$() {
    return this._recordService.getRecords(
      LibraryService.resource,
      undefined,
      1,
      1
    ).pipe(
      map((results: Record) => this._recordService.totalHits(results.hits.total))
    );
  }

  /**
   * Get Library
   * @param pid - Library pid
   * @return Observable
   */
  get$(pid: string) {
    return this._recordService.getRecord(LibraryService.resource, pid);
  }

  /**
   * Get all order by column name
   * @param order - string, order name
   */
  allOrderBy$(order: string = 'name') {
    return this._recordService.getRecords(
      LibraryService.resource, undefined, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, order
    );
  }
}
