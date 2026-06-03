/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import type { Error, EsResult } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionEventApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get Events
   * @param feePid - string
   * @return Observable
   */
  getEvents(feePid: string, sort = 'created'): Observable<EsResult | Error> {
    return this.recordService.getRecords(
      'patron_transaction_events',
      { query: `parent.pid:${feePid}`, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, headers: BaseApi.reroJsonheaders, sort }
    );
  }
}
