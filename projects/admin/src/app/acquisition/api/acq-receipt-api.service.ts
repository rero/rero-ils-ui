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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService, RecordUiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IAcqReceipt, IAcqReceiptLine } from '../classes/receipt';
import { AcqResponseReceiptLineStatus, ICreateLineMessage, IResponseReceiptLine } from '../components/receipt/receipt-form/order-receipt';

@Injectable({
  providedIn: 'root'
})
export class AcqReceiptApiService {

  private apiService: RecordService = inject(RecordService);
  private recordUiService: RecordUiService = inject(RecordUiService);
  private httpClient: HttpClient = inject(HttpClient);
  private translateService: TranslateService = inject(TranslateService);

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name for an acquisition receipt */
  readonly resourceName = 'acq_receipts';

  /** Default value for an AcqReceipt */
  public readonly receiptDefaultData = {
    exchange_rate: 0,
    amount_adjustments: [],
    quantity: 0,
    total_amount: 0,
    receipt_lines: [],
    notes: []
  };
  public readonly receiptLineDefaultData = {
    quantity: 0,
    amount: 0,
    notes: []
  };

  /** default options to get records */
  private readonly _defaultRecordOptions = {
    headers: { Accept: 'application/json'},
    sort: 'receipt_date'
  };
  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedReceiptSubject$: Subject<IAcqReceipt> = new Subject();
  private _deletedReceiptLineSubject$: Subject<IAcqReceiptLine> = new Subject();

  // GETTER AND SETTER ========================================================
  /** expose _deletedOrderLineSubject$ in 'readonly' mode */
  get deletedReceiptSubject$(): Observable<IAcqReceipt> { return this._deletedReceiptSubject$.asObservable(); }
  get deletedReceiptLineSubject$(): Observable<IAcqReceiptLine> { return this._deletedReceiptLineSubject$.asObservable(); }

  // READ/LIST FUNCTIONS ======================================================
  /**
   * Get acquisition receipt record.
   * @param pid - the receipt pid to search.
   * @returns ElasticSearch response for this receipt or null if error occurred.
   */
  getReceipt(pid: string): Observable<IAcqReceipt> {
    return this.apiService
      .getRecord(this.resourceName, pid, 1, BaseApi.reroJsonheaders)
      .pipe(
        map(data => ({...this.receiptDefaultData, ...data.metadata}) )
      );
  }

  /**
   * Search about acquisition receipts.
   * @param query - the query used to filter the receipts.
   * @param [options] - the additional options to get the records.
   * @returns ElasticSearch response corresponding to search criteria.
   */
  searchReceipts(query: string, options?: {
    headers?: object,
    sort?: string
  }): Observable<IAcqReceipt[]> {
    options = {...this._defaultRecordOptions, ...options};  // add some default params
    return this.apiService
      .getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, options.headers, options.sort)
      .pipe(
        map((result: Record) => this.apiService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...this.receiptDefaultData, ...hit.metadata}) ))
      );
  }

  /**
   * Load all receipts related to an AcqOrder
   * @param orderPid - the pid of the parent AcqOrder
   * @returns the list of corresponding AcqReceipt
   */
  getReceiptsForOrder(orderPid: string): Observable<IAcqReceipt[]> {
    return this.searchReceipts(`acq_order.pid:${orderPid}`);
  }

  /**
   * Get all receipt lines related to a receipt
   * @param receiptPid - the parent receipt pid
   * @returns an observable of AcqReceiptLines sorted on `receipt_date`
   */
  getReceiptLines(receiptPid: string): Observable<IAcqReceiptLine[]> {
    const query = `acq_receipt.pid:${receiptPid}`;
    return this.apiService
      .getRecords('acq_receipt_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE,
                  undefined, undefined, BaseApi.reroJsonheaders, 'receipt_date')
      .pipe(
        map((result: Record) => this.apiService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...this.receiptLineDefaultData, ...hit.metadata}) ))
      );
  }

  // CREATE FUNCTIONS =========================================================
  /**
   * Create acquisition receipt record.
   * @param record - the receipt data to create
   * @returns created receipt data if success or null if failed
   */
  createReceipt(record: any): Observable<IAcqReceipt> {
    return this.apiService
      .create(this.resourceName, record)
      .pipe(
        map((data: any) => ({...this.receiptDefaultData, ...data.metadata}) )
      );
  }

  /**
   * Allow to create receipt lines for a specific receipt
   * @param receiptPid - the parent receipt pid
   * @param lines - the lines data to create
   * @returns the list of performed data. Each line has a status to specify if the creation was well done.
   */
  createReceiptLines(receiptPid: string, lines: IAcqReceiptLine[]): Observable<ICreateLineMessage> {
    const generalErrorMessage = this.translateService.instant('Error proceeding receipt lines creation');
    const url = `/api/acq_receipt/${receiptPid}/lines`;
    return this.httpClient
      .post<any>(url, lines)
      .pipe(
        map((response: IResponseReceiptLine) => response.response),
        map((response: IResponseReceiptLine[]) => {
          if (response === null) {  // no response
            throw new Error(generalErrorMessage);
          } else if (response.some((line) => line.status === AcqResponseReceiptLineStatus.FAILURE)) {  // Response but with some errors
            const errorMessages = response
              .filter((line: IResponseReceiptLine) => line.status === AcqResponseReceiptLineStatus.FAILURE)
              .map((line: IResponseReceiptLine) => line.error_message);
            throw Error(errorMessages.join('\n'));
          }
          return {success: true};
        }),
        catchError((err) => of({success: false, messages: err.toString()}))
      );
  }

  // UPDATE FUNCTIONS =========================================================
  /**
   * Update acquisition receipt record.
   * @param receiptPid - the receipt pid.
   * @param record - the data corresponding to the receipt
   * @returns the API response with receipt data or null if operation failed.
   */
  updateReceipt(receiptPid: string, record: any): Observable<any|null> {
    return this.apiService
      .update(this.resourceName, receiptPid, record)
      .pipe(
        map((response: any) => ({ ...this.receiptDefaultData, ...response.metadata}) )
      );
  }

  // DELETE FUNCTIONS ========================================================
  /**
   * Allow to delete an AcqReceipt.
   * This function doesn't return any value but `deletedReceiptSubject$` is emitted when the receipt is correctly deleted.
   * @param receipt - the receipt to delete
   */
  delete(receipt: IAcqReceipt): void {
    this.recordUiService
      .deleteRecord(this.resourceName, receipt.pid)
      .subscribe((success: boolean) => {
          if (success) {
            this._deletedReceiptSubject$.next(receipt);
          }
        }
      );
  }

  /**
   * Allow to delete a receipt line by pid.
   * This function doesn't return any value but the `deletedReceiptLineSubject$` is emitted when the receipt line is correctly deleted.
   * @param receiptLine - the receipt line to delete
   */
  deleteReceiptLine(receiptLine: IAcqReceiptLine): void {
    this.recordUiService
      .deleteRecord('acq_receipt_lines', receiptLine.pid)
      .subscribe((success: boolean) => {
        if (success) {
          this._deletedReceiptLineSubject$.next(receiptLine);
        }
      });
  }
}
