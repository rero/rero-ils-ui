/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { Error } from '@rero/ng-core/lib/error/error';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqAccount } from '../classes/account';

@Injectable({
  providedIn: 'root'
})
export class AcqAccountApiService {

  /** The resource name of acquisition account */
  resourceName = 'acq_accounts';

  /**
   * Constructor
   * @param _http: HttpClient
   * @param _recordService - RecordService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService
  ) {}

  /**
   * Get account visible for the current library
   * @param libraryPid: the current library
   * @param parentPid: the parent account pid, if `null` then the root account will be return (optional)
   * @param options: the additional options to get the records (optional)
   * @return an observable of ElasticSearch response corresponding to search criteria
   */
   getAccounts(libraryPid: string, parentPid?: string, options?: { sort?: string }): Observable<any> {
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
    return this._recordService
      .getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, options.sort);
  }

  /**
   * Try to delete an account
   * @param pid: the account pid
   * @return The observable on delete REST call.
   */
  delete(pid: string): Observable<void | Error> {
    return this._recordService.delete(this.resourceName, pid);
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
    return this._http.get<any>(apiUrl, { params });
  }
}
