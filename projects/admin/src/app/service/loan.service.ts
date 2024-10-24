/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
 * along with this program.  If not, see <httpClient://www.gnu.org/licenses/>.
 */


import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { UserService } from '@rero/shared';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CircPolicy } from '../classes/circ-policy';
import { LoanState } from '../classes/loans';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

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
    return this.httpClient.post<any>(url, {
      item_pid: itemPid,
      pid: loanPid,
      transaction_library_pid: transactionLibraryPid,
      // TODO: Fix this with multiple patron
      transaction_user_pid: this.userService.user.patrons[0].pid
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
    return this.httpClient.post<any>(url, {
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
    return this.httpClient.get<CircPolicy>(apiUrl);
  }

  /**
   * Cancel request dialog.
   */
  cancelRequestDialog(event: Event, accept?: Function, reject?: Function): void {
    const confirmation: Confirmation = {
      target: event.target as EventTarget,
      header: this.translateService.instant('Cancel request'),
      message: this.translateService.instant('Do you really want to cancel the request?'),
      acceptLabel: this.translateService.instant('Yes'),
      rejectLabel: this.translateService.instant('No'),
      dismissableMask: true,
    };
    if (accept) {
      confirmation.accept = accept;
    }
    if (reject) {
      confirmation.reject = reject;
    }
    this.confirmationService.confirm(confirmation);
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
    return this.recordService.getRecords('loans', query, 1, 100, [], undefined, undefined, 'created');
  }
}
