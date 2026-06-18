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
export class IllRequestApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get ill request
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param headers - object
   * @return Observable
   */
  getIllRequest(
    patronPid: string,
    page: number,
    itemsPerPage = 10,
    headers = BaseApi.reroJsonheaders
  ): Observable<EsResult | Error> {
    const query = `patron.pid:${patronPid}`;
    return this.recordService.getRecords('ill_requests', { query, page, itemsPerPage, headers });
  }

  /**
   * Get ILL request for public view (filtered on statuses)
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param headers - object
   * @return Observable
   */
  getPublicIllRequest(
    patronPid: string,
    page: number,
    itemsPerPage = 10,
    headers = BaseApi.reroJsonheaders,
    sort = '-created',
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    filters?: {[key: string]: string}
  ): Observable<EsResult | Error> {
    const query = `patron.pid:${patronPid}`;
    return this.recordService.getRecords('ill_requests', { query, page, itemsPerPage, preFilters: filters, headers, sort });
  }
}
