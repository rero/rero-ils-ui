/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@rero/shared';
import { RouteToolService } from '@app/admin/routes/route-tool.service';
import {
  PatronTransaction,
  PatronTransactionEvent,
  PatronTransactionEventType,
  PatronTransactionStatus
} from '@app/admin/classes/patron-transaction';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionService {

  /** subject containing current loaded PatronTransactions */
  patronTransactionsSubject$: BehaviorSubject<Array<PatronTransaction>> = new BehaviorSubject([]);
  /** subject emitting accounting transaction about patron fees */
  patronFeesOperationSubject$: Subject<number> = new Subject();

  constructor(
    private _recordService: RecordService,
    private _userService: UserService,
    private _routeToolService: RouteToolService,
    private _toastService: ToastrService,
    private _translateService: TranslateService
  ) { }

  /**
   * Allow to build the query to send through the API to retrieve desired data
   * @param patronPid - the patron pid
   * @param loanPid - the loan pid
   * @param type - the patron transaction main type
   * @param status - the patron transaction status
   * @returns string representing the query to used based on function arguments
   */
  private _buildQuery(patronPid?: string, loanPid?: string, type?: string, status?: string): string {
    const params: Array<string> = [];
    if (patronPid !== undefined) {
      params.push(`patron.pid:${patronPid}`);
    }
    if (loanPid !== undefined) {
      params.push(`loan.pid:${loanPid}`);
    }
    if (type !== undefined) {
      params.push(`type:${type}`);
    }
    if (status !== undefined) {
      params.push(`status:${status}`);
    }
    return params.join(' AND ');
  }

  /**
   * Load all patron-transactions corresponding to query parameter
   * @param query - The query used to retrieve `PatronTransaction`
   * @param sort - The field used to sort the `PatronTransaction`
   * @returns an observable of `PatronTransaction` corresponding to criteria
   */
  private _loadPatronTransactions(query: string, sort: string = '-creation_date'): Observable<Array<PatronTransaction>> {
    return this._recordService.getRecords(
      'patron_transactions',
      query,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      undefined,
      sort
    ).pipe(
      map((data: Record) => data.hits),
      map(hits => this._recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map(hits => hits.map( hit => new PatronTransaction(hit.metadata)))
    );
  }

  /**
   * Observable on PatronTransactions about a specific loan
   * @param loanPid - the loan pid
   * @param type - the patron transaction type to retrieve
   * @param status - the patron transactions status to retrieve
   * @returns an observable of `PatronTransaction` corresponding to criteria
   */
  patronTransactionsByLoan$(loanPid: string, type?: string, status?: string): Observable<Array<PatronTransaction>> {
    const query = this._buildQuery(undefined, loanPid, type, status);
    return this._recordService.getRecords('patron_transactions', query, 1, RecordService.MAX_REST_RESULTS_SIZE).pipe(
      map((data: Record) => data.hits),
      map(hits => this._recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map(hits => hits.map( hit => new PatronTransaction(hit.metadata)))
    );
  }

  /**
   * Search for `PatronTransactions` about a specific patron
   * @param patronPid - the patron pid
   * @param type - the patron transaction type to retrieve
   * @param status - the patron transactions status to retrieve
   * @returns an observable of `PatronTransaction` corresponding to criteria
   */
  patronTransactionsByPatron$(patronPid: string, type?: string, status?: string): Observable<Array<PatronTransaction>> {
    const query = this._buildQuery(patronPid, undefined, type, status);
    return this._loadPatronTransactions(query);
  }

  /**
   * Emit the patronTransactionByPatron subject for a specific patron
   * @param patronPid - the patron pid
   * @param type - the patron transaction type to retrieve
   * @param status - the patron transactions status to retrieve
   */
  emitPatronTransactionByPatron(patronPid: string, type?: string, status?: string) {
    this.patronTransactionsByPatron$(patronPid, type, status).subscribe(
      (transactions) => this.patronTransactionsSubject$.next(transactions)
    );
  }

  /**
   * Load events linked to a patron transaction
   * @param transaction - the parent transaction
   */
  loadTransactionHistory(transaction: PatronTransaction) {
    const query = `parent.pid:${transaction.pid}`;
    this._recordService.getRecords('patron_transaction_events', query, 1, RecordService.MAX_REST_RESULTS_SIZE).pipe(
      map((data: Record) => data.hits),
      map(hits => this._recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map(hits => hits.map(hit => new PatronTransactionEvent(hit.metadata)))
    ).subscribe(events => transaction.events = events);
  }

  /**
   * Compute the total due amount for a list of patron-transactions.
   * Only patron-transactions with a status === "open" are used to compute the total
   * @param transactions - the transactions to process
   * @returns total amount of open transactions
   */
  computeTotalTransactionsAmount(transactions: Array<any>): number {
    return transactions.reduce((accumulator, transaction) => {
      return (transaction.status === PatronTransactionStatus.OPEN)
        ? parseFloat((accumulator + transaction.total_amount).toFixed(2))
        : accumulator;
    }, 0);

  }


  // PatronTransaction API methods ================================================================

  /**
   * Create PatronTransactionEvent skeleton with data from current context
   * @param transaction - the parent patron transaction
   * @returns An object with `parent`, `operator` and `library` fields fill with current context
   */
  private _buildTransactionEventsSkeleton(transaction: PatronTransaction): any {
    const currentUser = this._userService.user;
    return {
      parent: {
        $ref: this._routeToolService.apiService.getRefEndpoint('patron_transactions', transaction.pid)
      },
      operator: {
        $ref: this._routeToolService.apiService.getRefEndpoint('patrons', currentUser.patronLibrarian.pid)
      },
      library: {
        $ref: this._routeToolService.apiService.getRefEndpoint('libraries', currentUser.currentLibrary)
      }
    };
  }

  /**
   * Allow to register a payment about a patron transaction
   * @param transaction - the parent patron transaction
   * @param amount - the paid amount
   * @param paymentMethod - Method used to pay the patron transaction
   */
  payPatronTransaction(transaction: PatronTransaction, amount: number, paymentMethod: string) {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.PAYMENT;
    record.subtype = paymentMethod;
    record.amount = amount;
    this.patronFeesOperationSubject$.next(0 - amount);
    this._createTransactionEvent(record, transaction.patron.pid);
  }

  /**
   * Allow to register a dispute about a patron transaction
   * @param transaction: PatronTransaction - the parent patron transaction
   * @param reason: The reason of the dispute
   */
  disputePatronTransaction(transaction: PatronTransaction, reason: string) {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.DISPUTE;
    record.note = reason;
    this._createTransactionEvent(record, transaction.patron.pid);
  }

  /**
   * Allow to register a 'cancel' about a patron transaction
   * @param transaction - the parent patron transaction
   * @param amount - the amount to cancel
   * @param reason - The reason why the transaction is canceled
   */
  cancelPatronTransaction(transaction: PatronTransaction, amount: number, reason: string) {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.CANCEL;
    record.amount = amount;
    record.note = reason;
    this.patronFeesOperationSubject$.next(0 - amount);
    this._createTransactionEvent(record, transaction.patron.pid);
  }

  /**
   * Call API to create the PatronTransactionEvent
   * @param record - data to send through the API
   * @param affectedPatron - the user pid affected by this new transaction event
   */
  private _createTransactionEvent(record: any, affectedPatron: string) {
    this._recordService.create('patron_transaction_events', record).subscribe(
      () => {
        this.emitPatronTransactionByPatron(affectedPatron, undefined, 'open');
        const translateType = this._translateService.instant(record.type);
        this._toastService.success(this._translateService.instant('{{ type }} registered', {type: translateType}));
      },
      (error) => {
        const errorMessage = (error.hasOwnProperty('message') && error.message().hasOwnProperty('message'))
          ? error.message.message
          : 'Server error :: ' + (error.title || error.toString());
        const message = '[' + error.status + ' - ' + error.statusText + '] ' + errorMessage;
        const translateType = this._translateService.instant(record.type);
        this._toastService.error(
          message,
          this._translateService.instant('{{ type }} creation failed!', { type: translateType }),
          {disableTimeOut: true, closeButton: true, enableHtml: true}
        );
      }
    );
  }
}
