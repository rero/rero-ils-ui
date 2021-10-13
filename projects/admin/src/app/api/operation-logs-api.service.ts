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
import { BaseApi } from '@rero/shared';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperationLogsApiService extends BaseApi {

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /**
   * Get Operation logs by resource type and resource pid
   * @param resourceType - string
   * @param resourcePid - string
   * @param action - string
   * @param page - number
   * @param itemPerPage - number
   * @param sort - string
   * @return Observable
   */
  getLogs(
    resourceType: string, resourcePid: string, action: 'create'|'update',
    page: number, itemPerPage = 5, sort = 'mostrecent'): Observable<Record | Error> {
    const query = `record.type:${resourceType} AND record.value:${resourcePid} AND operation:${action}`;
    return this._recordService.getRecords(
      'operation_logs', query, page, itemPerPage,
      undefined, undefined, undefined, sort
    );
  }

  /**
   * Get Circulation logs by item
   * @param resourcePid - string
   * @param page - number
   * @param itemPerPage - number
   * @param sort - string
   * @returns Observable
   */
  getCirculationLogs(resourcePid: string, page: number, itemPerPage = 5, sort = 'mostrecent'): Observable<Record | Error> {
    const query = `_exists_:loan AND loan.item.pid:${resourcePid}`;
    return this._recordService.getRecords(
      'operation_logs', query, page, itemPerPage,
      undefined, undefined, undefined, sort
    );
  }

  /**
   * Get history
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @return Observable
   */
   getCheckInHistory(patronPid: string, page: number, itemsPerPage: number = 10): Observable<Record | Error> {
    const date = moment().subtract(6, 'months').utc().format('YYYY-MM-DDTHH:mm:ss');
    const query = `_exists_:loan AND loan.patron.pid:${patronPid} AND loan.trigger:checkin AND date:[${date} TO *]`;
    return this._recordService.getRecords(
      'operation_logs', query, page, itemsPerPage,
      undefined, undefined, BaseApi.reroJsonheaders, 'mostrecent'
    );
  }

  /**
   * Get history by load pid
   * @param loanPid - string
   * @param type - string
   * @returns Observable
   */
  getHistoryByLoanPid(loanPid: string, type: string = 'checkin'): Observable<Record | Error> {
    const query = `_exists_:loan AND loan.pid:${loanPid} AND loan.trigger:${type}`;
    return this._recordService.getRecords(
      'operation_logs', query, 1, 1,
      undefined, undefined, BaseApi.reroJsonheaders
    ).pipe(map((result: any) => {
      return this._recordService.totalHits(result.hits.total) === 1
      ? result.hits.hits[0]
      : {};
    }));
  }
}
