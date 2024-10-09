/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { Error, Record, RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationLogsApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get history
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param headers - object
   * @return Observable
   */
  getHistory(
    patronPid: string, page: number,
    itemsPerPage: number = 10
  ): Observable<Record | Error> {
    const date = moment().subtract(6, 'months').utc().format('YYYY-MM-DDTHH:mm:ss');
    const query = `record.type:loan AND loan.patron.pid:${patronPid} AND loan.trigger:checkin AND date:[${date} TO *]`;
    return this.recordService.getRecords(
      'operation_logs', query, page, itemsPerPage,
      undefined, undefined, undefined, 'mostrecent'
      );
  }
}
