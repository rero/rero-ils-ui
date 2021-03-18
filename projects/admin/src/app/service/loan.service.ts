/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { map } from 'rxjs/operators';
import { LoanState } from '../classes/loans';
import { UserService } from '@rero/shared';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  /** Statuses of a borrow loan */
  static borrowStatuses = [
    LoanState.ITEM_ON_LOAN
  ];

  /** Statuses of a request loan */
  static requestStatuses = [
    LoanState.ITEM_AT_DESK,
    LoanState.PENDING,
    LoanState.ITEM_IN_TRANSIT_FOR_PICKUP
  ];

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _http - HttpClient
   * @param _userService - UserService
   */
  constructor(
    private _recordService: RecordService,
    private _http: HttpClient,
    private _userService: UserService
  ) { }

  /**
   * Return a borrowed loan record
   * @param itemPid Item Pid
   * @return Observable
   */
  borrowedBy$(itemPid: string) {
    return this.loans$(itemPid, LoanService.borrowStatuses).pipe(
      map((results: Record) => results.hits.hits)
    );
  }

  /**
   * Return a list of requested loan(s)
   * @param itemPid Item Pid
   * @return Observable
   */
  requestedBy$(itemPid: string) {
    return this.loans$(itemPid, LoanService.requestStatuses).pipe(
      map((results: Record) => results.hits.hits)
    );
  }

  /**
   * Cancel a loan related to an item
   * @param itemPid: item pid related to the loan to cancel
   * @param loanPid: loan to cancel pid
   * @param transactionLibraryPid: transaction library pid
   * @return item data
   */
  cancelLoan(itemPid: string, loanPid: string, transactionLibraryPid: string) {
    const url = '/api/item/cancel_item_request';
    return this._http.post<any>(url, {
      item_pid: itemPid,
      pid: loanPid,
      transaction_library_pid: transactionLibraryPid,
      // TODO: Fix this with multiple patron
      transaction_user_pid: this._userService.user.patrons[0].pid
    }).pipe(
    map(data => {
      const itemData = data.metadata;
      itemData.loan = data.action_applied.cancel;
      return itemData;
    }));
  }

  /**
   * Update the pickup location of a loan
   * @param loan: loan to update
   * @param pickupLocationPid: pickup location pid to update
   * @return loan data
   */
  updateLoanPickupLocation(loanPid: string, pickupLocationPid: string) {
    const url = '/api/item/update_loan_pickup_location';
    return this._http.post<any>(url, {
      pid: loanPid,
      pickup_location_pid: pickupLocationPid
    }).pipe(
      map(loanData => {
      return loanData;
    }));
  }

  /**
   * Search about loans related to an item
   * @param itemPid - string: the item pid
   * @param statuses - Array: a list of loan states to filter result.
   * @return Observable
   */
  private loans$(itemPid: string, statuses?: Array<LoanState>) {
    let query = `item_pid.value:${itemPid}`;
    if (statuses !== undefined) {
      const states = statuses.join(' OR state:');
      query +=  ` AND (state:${states})`;
    }
    return this._recordService.getRecords('loans', query, 1, 100, [], undefined, undefined, 'created');
  }
}
