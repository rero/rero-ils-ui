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
import { Record, RecordService } from '@rero/ng-core';
import { Error } from '@rero/ng-core/lib/error/error';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAcqAccount } from '../classes/account';

@Injectable({
  providedIn: 'root'
})
export class AcqAccountApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private recordService: RecordService = inject(RecordService);

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name of acquisition account */
  resourceName = 'acq_accounts';

  /** Default values */
  public readonly exceedanceDefaultData = {
    amount: 0,
    value: 0
  };
  public readonly allocatedAmountDefaultData = {
    self: 0,
    children: 0,
    total: 0
  };
  public readonly accountDefaultData = {
    name: '',
    number: '',
    depth: 0,
    is_active: false,
    allocated_amount: 0,
    distribution: 0,
    encumbrance_exceedance: this.exceedanceDefaultData,
    expenditure_exceedance: this.exceedanceDefaultData,
    encumbrance_amount: this.allocatedAmountDefaultData,
    expenditure_amount: this.allocatedAmountDefaultData,
    remaining_balance: this.allocatedAmountDefaultData
  };

  // SERVICES FUNCTIONS =======================================================

  /**
   * Get account from ES (metadata from ES much more complete than DB stored record)
   * @param accountPid - the account pid.
   * @returns the corresponding account
   */
  getAccount(accountPid: string): Observable<IAcqAccount> {
    return this.recordService
      .getRecords(this.resourceName, `pid:${accountPid}`, 1, 1)
      .pipe(
        map((result: Record) => this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map((hit: any) => ({...this.accountDefaultData, ...hit.metadata}) )),
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
      .getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, options.sort)
      .pipe(
        map((result: Record) => this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...this.accountDefaultData, ...hit.metadata}) ))
      );
  }

  /**
   * Try to delete an account
   * @param pid: the account pid
   * @return The observable on delete REST call.
   */
  delete(pid: string): Observable<void | Error> {
    return this.recordService.delete(this.resourceName, pid);
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
