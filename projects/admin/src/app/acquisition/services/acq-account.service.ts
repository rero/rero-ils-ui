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

import { Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { Error } from '@rero/ng-core/lib/error/error';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AcqAccountApiService } from '../api/acq-account-api.service';
import { AcqAccount } from '../classes/account';

@Injectable({
  providedIn: 'root'
})
export class AcqAccountService {

  /**
   * Constructor
   * @param _acqAccountApiService - AcqAccountApiService
   * @param _recordService - RecordService
   */
  constructor(
    private _acqAccountApiService: AcqAccountApiService,
    private _recordService: RecordService
  ) { }

  /**
   * Get account visible for the current used library.
   * @param parentPid: the parent account pid, if `null` then the root account will be return (optional)
   * @param options: the additional options to get the records (optional)
   * @return an observable of account corresponding to search criteria
   */
  getAccounts(parentPid?: string, options?: {
    sort?: string
  }): Observable<AcqAccount[]> {
    return this._acqAccountApiService
      .getAccounts(parentPid, options)
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map((hit: any) => new AcqAccount(hit.metadata)))
      );
  }

  /**
   * Try to delete an account
   * @param pid: the account pid
   * @return The observable on delete REST call.
   */
  delete(pid: string): Observable<void | Error> {
    return this._acqAccountApiService.delete(pid);
  }


  /**
   * Transfer funds between two account
   * @param sourcePid: the source account pid.
   * @param targetPid: the target account pid.
   * @param amount: the amount to transfer between two accounts.
   * @return An observable on the call API result.
   */
  transferFunds(sourcePid: string, targetPid: string, amount: number): Observable<any> {
    return this._acqAccountApiService.transferFunds(sourcePid, targetPid, amount);
  }
}
