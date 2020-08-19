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
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  /**
   * Status of a borrow loan
   */
  statusBorrow = {
    ON_LOAN: 'ITEM_ON_LOAN'
  };

  /**
   * Statuses of a request loan
   */
  statusRequest = {
    AT_DESK: 'ITEM_AT_DESK',
    PENDING: 'PENDING',
    IN_TRANSIT_FOR_PICKUP: 'ITEM_IN_TRANSIT_FOR_PICKUP'
  };

  /**
   * Constructor
   * @param _recordService RecordService
   */
  constructor(
    private _recordService: RecordService,
    private _http: HttpClient,
    private _userService: UserService
  ) { }

  /**
   * Return the number of request(s) on item
   * @param itemPid Item Pid
   * @return Observable
   */
  numberOfRequests$(itemPid: string) {
    const states = Object.values(this.statusRequest).join(' OR state:');
    const query = `item_pid.value:${itemPid} AND (state:${states})`;
    return this._recordService.getRecords('loans', query, 1, 1).pipe(
      map(result => result.hits.total)
    );
  }

  /**
   * Return a borrowed loan record
   * @param itemPid Item Pid
   * @return Observable
   */
  borrowedBy$(itemPid: string) {
    return this.loans$(itemPid).pipe(
      map(results => results.hits.hits.filter((data: any) =>
        data.metadata.state === this.statusBorrow.ON_LOAN
      ))
    );
  }

  /**
   * Return a list of requested loan(s)
   * @param itemPid Item Pid
   * @return Observable
   */
  requestedBy$(itemPid: string) {
    return this.loans$(itemPid).pipe(
      map(results => results.hits.hits.filter((data: any) =>
          data.metadata.state === this.statusRequest.AT_DESK
          || data.metadata.state === this.statusRequest.PENDING
          || data.metadata.state === this.statusRequest.IN_TRANSIT_FOR_PICKUP
      ))
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
      transaction_user_pid: this._userService.getCurrentUser().pid
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
   * Loans
   * @param itemPid Item Pid
   * @return Observable
   */
  private loans$(itemPid: string) {
    // TODO: Add sort parameter on transaction_date (after update ng-core)
    const statuses = [
      ...Object.values(this.statusBorrow),
      ...Object.values(this.statusRequest)
    ];
    const states = statuses.join(' OR state:');
    const query = `item_pid.value:${itemPid} AND (state:${states})`;
    return this._recordService.getRecords('loans', query, 1, 100);
  }
}
