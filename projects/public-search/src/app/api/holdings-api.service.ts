/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Record, RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryResponse } from '../record';
@Injectable({
  providedIn: 'root'
})
export class HoldingsApiService extends BaseApi {

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /**
   * Get Holdings by document pid and viewcode
   * @param documentPid - string
   * @param viewcode - string
   * @return Observable
   */
  getHoldingsByDocumentPidAndViewcode(
    documentPid: string, viewcode: string, page: number, itemsPerPage: number = 5): Observable<QueryResponse> {
    const query = `document.pid:${documentPid}
    AND ((holdings_type:standard AND public_items_count:[1 TO *]) OR holdings_type:serial)`;
    return this._recordService
    .getRecords('holdings', query, page, itemsPerPage, undefined, { view: viewcode }, BaseApi.reroJsonheaders)
    .pipe(map((response: Record) => response.hits));
  }
}
