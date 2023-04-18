/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { DialogService, RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CircPolicy } from '../classes/circ-policy';
import { LoanState } from '../classes/loans';
import { UserService } from '@rero/shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  // SERVICE CONSTANTS ========================================================
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

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _http - HttpClient
   * @param _userService - UserService
   * @param _translateService - TranslateService
   */
  constructor(
    private _recordService: RecordService,
    private _http: HttpClient,
    private _userService: UserService,
    private _translateService: TranslateService,
    private _dialogService: DialogService
  ) { }

  // SERVICES FUNCTIONS =======================================================
  /**
   * Return a borrowed loan records
   * @param itemPid - the item pid to search
   * @returns Observable about borrowed loans
   */
  borrowedBy$(itemPid: string): Observable<any> {
    return this.loans$(itemPid, LoanService.borrowStatuses)
      .pipe(
        map((results: Record) => results.hits.hits)
      );
  }

  /**
   * Return a list of requested loan records
   * @param itemPid - the item pid to search
   * @returns Observable about requested loans
   */
  requestedBy$(itemPid: string): Observable<any> {
    return this.loans$(itemPid, LoanService.requestStatuses)
      .pipe(
        map((results: Record) => results.hits.hits)
    );
  }

  /**
   * Can cancel a request
   * @param loan - Loan record
   * @returns true if it is possible to cancel a loan
   */
  canCancelRequest(loan: any): boolean {
    // TODO: To increase the complexity, it is better to implement a backend api
    return [LoanState.PENDING, LoanState.ITEM_IN_TRANSIT_FOR_PICKUP, LoanState.ITEM_AT_DESK]
      .some((element) => element === loan.metadata.state)
  }

  /**
   * Cancel a loan related to an item
   * @param itemPid - item pid related to the loan to cancel
   * @param loanPid - loan pid to cancel
   * @param transactionLibraryPid - transaction library pid
   * @returns Observable about item data
   */
  cancelLoan(itemPid: string, loanPid: string, transactionLibraryPid: string): Observable<any> {
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
      })
    );
  }

  /**
   * Check if request pickup location can be changed.
   * @returns true if it is possible to update pickup location.
   */
  canUpdateRequestPickupLocation(transaction: any): boolean {
    // TODO: To increase the complexity, it is better to implement a backend api
    return [LoanState.PENDING, LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]
      .some((element) => element === transaction.metadata.state)
  }

  /**
   * Update the pickup location of a loan
   * @param loanPid - loan pid to update
   * @param pickupLocationPid - pickup location pid to update
   * @returns Observable about the updated loan data
   */
  updateLoanPickupLocation(loanPid: string, pickupLocationPid: string): Observable<any> {
    const url = '/api/item/update_loan_pickup_location';
    return this._http.post<any>(url, {
      pid: loanPid,
      pickup_location_pid: pickupLocationPid
    });
  }

  /**
   * Get circulation policy related to a loan
   * @param loanPid - the loan pid to search
   * @returns Observable to the corresponding cipo.
   */
  getCirculationPolicy(loanPid: string): Observable<CircPolicy> {
    const apiUrl = `/api/loan/${loanPid}/circulation_policy`;
    return this._http.get<CircPolicy>(apiUrl);
  }

  /**
   * Cancel request dialog.
   * @returns Observable (true if the user confirms the cancellation)
   */
  cancelRequestDialog(): Observable<boolean> {
    const config = {
      ignoreBackdropClick: true,
      initialState: {
        title: this._translateService.instant('Cancel request'),
        body: this._translateService.instant('Do you really want to cancel the request?'),
        confirmButton: true,
        cancelTitleButton: this._translateService.instant('No'),
        confirmTitleButton: this._translateService.instant('Yes')
      }
    };
    return this._dialogService.show(config);
  }

  // PRIVATES SERVICE FUNCTIONS ===============================================
  /**
   * Search about loans related to an item
   * @param itemPid - the item pid to search
   * @param statuses - a list of loan states to filter result.
   * @returns Observable with loans corresponding to search criteria
   */
  private loans$(itemPid: string, statuses?: Array<LoanState>): Observable<any> {
    let query = `item_pid.value:${itemPid}`;
    if (statuses !== undefined) {
      const states = statuses.join(' OR state:');
      query +=  ` AND (state:${states})`;
    }
    return this._recordService.getRecords('loans', query, 1, 100, [], undefined, undefined, 'created');
  }
}
