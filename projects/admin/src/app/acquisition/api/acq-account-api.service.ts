/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { accountDefaultData, IAcqAccount } from '../classes/account';

@Injectable({
  providedIn: 'root'
})
export class AcqAccountApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private recordService: RecordService = inject(RecordService);

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name of acquisition account */
  resourceName = 'acq_accounts';

  // SERVICES FUNCTIONS =======================================================

  /**
   * Get account from ES (metadata from ES much more complete than DB stored record)
   * @param accountPid - the account pid.
   * @returns the corresponding account
   */
  getAccount(accountPid: string): Observable<IAcqAccount> {
    return this.recordService
      .getRecords(this.resourceName, { query: `pid:${accountPid}`, page: 1, itemsPerPage: 1 })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map((hit: any) => ({...accountDefaultData, ...hit.metadata}) )),
        map((hits: IAcqAccount[]) => hits.find(Boolean))  // Get first element of array if exists
      );
  }

  /**
   * Get account visible for the current library
   * @param libraryPid: the current library
   * @param parentPid: the parent account pid, if `null` then the root account will be return (optional)
   * @param options: the additional options to get the records (optional)
   * @return: an observable of ElasticSearch response corresponding to search criteria
   */
   getAccounts(libraryPid: string, parentPid?: string, options?: { sort?: string }): Observable<IAcqAccount[]> {
    const defaultQueryParams = [
      'is_active:true',
      `library.pid:${libraryPid}`
    ];
    if (parentPid !== undefined) {
      const parentParam = (parentPid === null) ? 'depth:0' : `parent.pid:${parentPid}`;
      defaultQueryParams.push(parentParam);
    }
    const query = defaultQueryParams.join(' AND ');
    options = { ...{sort: 'name'}, ...options };  // add some default params
    return this.recordService
      .getRecords(this.resourceName, {
        query,
        page: 1,
        itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
        headers: { Accept: 'application/rero+json' },
        sort: options.sort
      })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...accountDefaultData, ...hit.metadata}) ))
      );
  }

  /**
   * Transfer funds between two account
   * @param sourcePid: the source account pid.
   * @param targetPid: the target account pid.
   * @param amount: the amount to transfer between two accounts.
   * @return An observable on the call API result.
   */
  transferFunds(sourcePid: string, targetPid: string, amount: number): Observable<any> {
    const apiUrl = '/api/acq_accounts/transfer_funds';
    const params = new HttpParams()
      .set('source', sourcePid)
      .set('target', targetPid)
      .set('amount', amount.toString());
    return this.httpClient.get<any>(apiUrl, { params });
  }
}
