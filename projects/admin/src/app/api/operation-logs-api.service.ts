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

  private recordService: RecordService = inject(RecordService);

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
    return this.recordService.getRecords('operation_logs', query, page, itemPerPage, undefined, undefined, BaseApi.reroJsonheaders, sort);
  }

  /**
   * Get Circulation logs
   * @param resourceType - the type of resource to search for.
   * @param resourcePid - the resource pid.
   * @param page - number
   * @param itemPerPage - number
   * @param filter - List of filters with a boolean value. Ex: { loan: true; notif: true; }
   * @param sort - string
   * @returns Observable
   */
  getCirculationLogs(
    resourceType: string, resourcePid: string, page: number, itemPerPage = 5, filters: object = {}, sort = 'mostrecent'): Observable<Record | Error> {
    const query = [];
    const queryField = (resourceType === 'loan')
      ? 'loan.pid'
      : 'loan.item.pid';
    query.push(`${queryField}:${resourcePid}`);
    // Extraction of filter keys
    const filterKeys = Object.keys(filters);
    // If one of the filters is false, we add the filter to the query
    if (!filterKeys.every((key: string) => filters[key] === true)) {
      const typeFilters = [];
      // We browse the keys of the filters object to extract the false value
      filterKeys.forEach((key: string) => {
        // If the filter is false, we add it
        if (!filters[key]) {
          typeFilters.push(`NOT record.type:${key}`);
        }
      });
      query.push(`(${typeFilters.join(' OR ')})`);
    }
    return this.recordService.getRecords('operation_logs', query.join(' AND '), page, itemPerPage, undefined, undefined, undefined, sort);
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
    const query = `_exists_:loan AND record.type:loan AND loan.patron.pid:${patronPid} AND loan.trigger:checkin AND date:[${date} TO *]`;
    return this.recordService.getRecords(
      'operation_logs', query, page, itemsPerPage, undefined, undefined, BaseApi.reroJsonheaders, 'mostrecent');
  }

  /**
   * Get history by load pid
   * @param loanPid - string
   * @param type - string
   * @returns Observable
   */
  getHistoryByLoanPid(loanPid: string, type: string = 'checkin'): Observable<Record | Error> {
    const query = `_exists_:loan AND loan.pid:${loanPid} AND loan.trigger:${type} AND record.type:loan`;
    return this.recordService.getRecords('operation_logs', query, 1, 1, undefined, undefined, BaseApi.reroJsonheaders)
      .pipe(map((result: any) => {
        return this.recordService.totalHits(result.hits.total) === 1
          ? result.hits.hits[0]
          : {};
      }));
  }
}
