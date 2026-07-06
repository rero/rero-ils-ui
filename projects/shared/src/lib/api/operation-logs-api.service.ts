// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import type { Error, EsResult } from '@rero/ng-core';
import { BaseApi } from '../api/base-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class OperationLogsApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get resource operation logs by resource type and resource pid.
   * @param resourceType - string
   * @param resourcePid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param sort - string
   * @return Observable
   */
  getLogs(
    resourceType: string, resourcePid: string, page: number,
    itemsPerPage = 10, sort = 'mostrecent'): Observable<EsResult | Error> {
    const query = `record.type:${resourceType} AND record.value:${resourcePid}`;
    return this.recordService.getRecords(
      'operation_logs', { query, page, itemsPerPage, headers: BaseApi.reroJsonheaders, sort });
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
    resourceType: string, resourcePid: string, page: number, itemPerPage = 5, filters: object = {}, sort = 'mostrecent'): Observable<EsResult | Error> {
    const query = [];
    const queryField = (resourceType === 'loan')
      ? 'loan.pid'
      : 'loan.item.pid';
    let fieldQuery = `${queryField}:${resourcePid}`;
    if (resourceType === 'item') {
      fieldQuery += ` OR scan.item.pid:${resourcePid}`;
      fieldQuery = `(${fieldQuery})`;
    }
    query.push(fieldQuery);
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
    return this.recordService.getRecords('operation_logs', { query: query.join(' AND '), page, itemsPerPage: itemPerPage, sort });
  }

  /**
   * Get history
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @return Observable
   */
   getCheckInHistory(patronPid: string, page: number, itemsPerPage = 10): Observable<EsResult | Error> {
    const date = DateTime.now().minus({ months: 6 }).toISO();
    const query = `_exists_:loan AND record.type:loan AND loan.patron.pid:${patronPid} AND loan.trigger:checkin AND date:[${date} TO *]`;
    return this.recordService.getRecords(
      'operation_logs', { query, page, itemsPerPage, headers: BaseApi.reroJsonheaders, sort: 'mostrecent' });
  }

  /**
   * Get history by load pid
   * @param loanPid - string
   * @param type - string
   * @returns Observable
   */
  getHistoryByLoanPid(loanPid: string, type = 'checkin'): Observable<EsResult | Error> {
    const query = `_exists_:loan AND loan.pid:${loanPid} AND loan.trigger:${type} AND record.type:loan`;
    return this.recordService.getRecords('operation_logs', { query, page: 1, itemsPerPage: 1, headers: BaseApi.reroJsonheaders })
      .pipe(map((result: any) => {
        return this.recordService.totalHits(result.hits.total) === 1
          ? result.hits.hits[0]
          : {};
      }));
  }
}
