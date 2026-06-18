// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import {
  PatronTransaction,
  PatronTransactionEvent,
  PatronTransactionEventType
} from '@app/admin/classes/patron-transaction';
import { RouteToolService } from '@app/admin/routes/route-tool.service';
import { TranslateService } from '@ngx-translate/core';
import type { EsResult } from '@rero/ng-core';
import { CONFIG, RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionService {

  private recordService: RecordService = inject(RecordService);
  private appStore = inject(AppStore);
  private routeToolService: RouteToolService = inject(RouteToolService);
  private translateService: TranslateService = inject(TranslateService);
  private messageService: MessageService = inject(MessageService);

  /**
   * Allow to build the query to send through the API to retrieve desired data
   */
  private _buildQuery(patronPid?: string, loanPid?: string, type?: string, status?: string): string {
    const params: string[] = [];
    if (patronPid !== undefined) { params.push(`patron.pid:${patronPid}`); }
    if (loanPid !== undefined) { params.push(`loan.pid:${loanPid}`); }
    if (type !== undefined) { params.push(`type:${type}`); }
    if (status !== undefined) { params.push(`status:${status}`); }
    return params.join(' AND ');
  }

  private _loadPatronTransactions(query: string, sort = '-creation_date'): Observable<PatronTransaction[]> {
    return this.recordService.getRecords(
      'patron_transactions',
      { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort }
    ).pipe(
      map((data: EsResult) => data.hits as any),
      map((hits: any) => +this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map((hits: any[]) => hits.map((hit: any) => new PatronTransaction(hit.metadata)))
    );
  }

  /**
   * Observable on PatronTransactions about a specific loan
   */
  patronTransactionsByLoan(loanPid: string, type?: string, status?: string): Observable<PatronTransaction[]> {
    const query = this._buildQuery(undefined, loanPid, type, status);
    return this.recordService.getRecords('patron_transactions', { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE }).pipe(
      map((data: EsResult) => data.hits as any),
      map((hits: any) => +this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map((hits: any[]) => hits.map((hit: any) => new PatronTransaction(hit.metadata)))
    );
  }

  /**
   * Search for `PatronTransactions` about a specific patron
   */
  patronTransactionsByPatron(patronPid: string, type?: string, status?: string): Observable<PatronTransaction[]> {
    const query = this._buildQuery(patronPid, undefined, type, status);
    return this._loadPatronTransactions(query);
  }

  /**
   * Load a single patron transaction by pid
   */
  loadTransaction(pid: string): Observable<PatronTransaction> {
    return this.recordService.getRecord('patron_transactions', pid).pipe(
      map((data: any) => new PatronTransaction(data.metadata))
    );
  }

  /**
   * Load events linked to a patron transaction
   */
  loadTransactionHistory(transaction: PatronTransaction): Observable<any> {
    const query = `parent.pid:${transaction.pid}`;
    return this.recordService.getRecords('patron_transaction_events', { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE }).pipe(
      map((data: EsResult) => data.hits as any),
      map((hits: any) => +this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map((hits: any[]) => hits.map((hit: any) => new PatronTransactionEvent(hit.metadata)))
    );
  }

  // PatronTransaction API methods ================================================================

  private _buildTransactionEventsSkeleton(transaction: PatronTransaction): any {
    return {
      parent: {
        $ref: this.routeToolService.apiService.getRefEndpoint('patron_transactions', transaction.pid)
      },
      operator: {
        $ref: this.routeToolService.apiService.getRefEndpoint('patrons', this.appStore.user().patronLibrarian.pid)
      },
      library: {
        $ref: this.routeToolService.apiService.getRefEndpoint('libraries', this.appStore.currentLibraryPid())
      }
    };
  }

  payPatronTransaction(transaction: PatronTransaction, amount: number, paymentMethod: string): Observable<void> {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.PAYMENT;
    record.subtype = paymentMethod;
    record.amount = amount;
    return this._createTransactionEvent(record);
  }

  disputePatronTransaction(transaction: PatronTransaction, reason: string): Observable<void> {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.DISPUTE;
    record.note = reason;
    return this._createTransactionEvent(record);
  }

  cancelPatronTransaction(transaction: PatronTransaction, amount: number, reason: string): Observable<void> {
    const record = this._buildTransactionEventsSkeleton(transaction);
    record.type = PatronTransactionEventType.CANCEL;
    record.amount = amount;
    record.note = reason;
    return this._createTransactionEvent(record);
  }

  private _createTransactionEvent(record: any): Observable<void> {
    return this.recordService.create('patron_transaction_events', record).pipe(
      tap(() => {
        const translateType = this.translateService.instant(record.type);
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Patron'),
          detail: this.translateService.instant('{{ type }} registered', { type: translateType }),
          life: CONFIG.MESSAGE_LIFE
        });
      }),
      map(() => void 0),
      catchError((error) => {
        const errorMessage = (Object.hasOwn(error, 'message') && Object.hasOwn(error.message(), 'message'))
          ? error.message.message
          : 'Server error :: ' + (error.title || error.toString());
        const message = '[' + error.status + ' - ' + error.statusText + '] ' + errorMessage;
        const translateType = this.translateService.instant(record.type);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('{{ type }} creation failed!', { type: translateType }),
          detail: message,
          sticky: true,
          closable: true
        });
        return of(void 0);
      })
    );
  }
}
