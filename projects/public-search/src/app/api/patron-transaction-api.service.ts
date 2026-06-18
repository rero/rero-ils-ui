// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import type { Error, EsResult } from '@rero/ng-core';
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
    itemsPerPage = 10, headers = BaseApi.reroJsonheaders,
    sort = 'creation_date'
  ): Observable<EsResult | Error> {
    const query = `patron.pid:${patronPid} AND status:${status}`;
    return this.recordService.getRecords(
      'patron_transactions', { query, page, itemsPerPage, headers, sort, facets: ['total'] }
    );
  }
}
