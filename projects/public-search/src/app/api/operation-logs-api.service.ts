// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import type { Error, EsResult } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { DateTime } from 'luxon';
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
    patronPid: string,
    page: number,
    itemsPerPage = 10
  ): Observable<EsResult | Error> {
    const date = DateTime.now().minus({ months: 6 }).toISO();
    const query = `record.type:loan AND loan.patron.pid:${patronPid} AND loan.trigger:checkin AND date:[${date} TO *]`;
    return this.recordService.getRecords(
      'operation_logs', { query, page, itemsPerPage, sort: 'mostrecent' }
      );
  }
}
