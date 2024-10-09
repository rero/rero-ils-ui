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
import { Record, RecordService } from '@rero/ng-core';
import { Error } from '@rero/ng-core/lib/error/error';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get fees
   * @param patronPid - string
   * @param status - string
   * @param page - number
   * @param itemsPerPage - number
   * @param headers - object
   * @return Observable
   */
  getFees(
    patronPid: string, status: string, page: number,
    itemsPerPage: number = 10, headers = BaseApi.reroJsonheaders
  ): Observable<Record | Error> {
    const query = `patron.pid:${patronPid} AND status:${status}`;
    return this.recordService.getRecords(
      'patron_transactions', query, page, itemsPerPage,
      undefined, undefined, headers, undefined, ['total']
    );
  }
}
