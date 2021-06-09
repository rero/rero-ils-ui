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
import { UserService } from '@rero/shared';
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
   * @param _userService - UserService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService,
    private _userService: UserService
  ) { }

  /**
   * Get account visible for the current used library.
   * @param parentPid: the parent account pid, if `null` then the root account will be return (optional)
   * @param sort: the sort method to used (optional)
   * @return an observable of account corresponding to search criteria
   */
  getAccounts(parentPid?: string, sort= 'name'): Observable<AcqAccount[]> {
    const params = [
      'is_active:true',
      `library.pid:${this._userService.user.currentLibrary}`
    ];
    if (parentPid !== undefined) {
      if (parentPid === null){
        params.push('depth:0');
      } else {
        params.push(`parent.pid:${parentPid}`);
      }
    }
    const query = params.join(' AND ');
    return this._recordService
      .getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, sort)
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: Array<any>) => hits.map((hit: any) => new AcqAccount(hit.metadata)))
      );
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


  /**
   * Allow to sort accounts to render it correctly (corresponding to hierarchical tree structure)
   * @param accounts - the accounts to sort.
   * @return Account list sorted as a hierarchical tree.
   */
  orderAccountsAsTree(accounts: Array<AcqAccount>): Array<AcqAccount> {
    /** Append an account and children accounts into the `accounts` list */
    const _appendAccount = (account: AcqAccount, list: Array<AcqAccount>) => {
      list.push(account);
      accounts.filter(acc => acc.parent !== undefined && acc.parent.pid === account.pid)
              .forEach(acc => _appendAccount(acc, list));
    };
    // First sort on depth and name.
    accounts.sort((a, b) => {
      return (a.depth === b.depth)
        ? a.name.localeCompare(b.name)
        : a.depth - b.depth;
    });
    // Rebuild hierarchical account tree.
    const sortedAccounts: Array<AcqAccount> = [];
    accounts.filter(acc => acc.depth === 0).forEach(acc => _appendAccount(acc, sortedAccounts));
    return sortedAccounts;
  }

}
