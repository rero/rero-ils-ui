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
import { Error } from '@rero/ng-core/lib/error/error';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionEventApiService extends BaseApi {

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /**
   * Get Events
   * @param feePid - string
   * @return Observable
   */
  getEvents(feePid: string): Observable<Record | Error> {
    return this._recordService.getRecords(
      'patron_transaction_events', `parent.pid:${feePid}`,
      1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, BaseApi.reroJsonheaders
    );
  }
}
