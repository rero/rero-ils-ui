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
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService, RecordUiService } from '@rero/ng-core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcqReceiptApiService } from '../api/acq-receipt-api.service';
import { AcqReceipt, IAcqReceiptLine } from '../classes/receipt';
import { AcqResponseReceiptLineStatus, ICreateLineMessage, IResponseReceiptLine } from '../components/receipt/receipt-form/order-receipt';

@Injectable({
  providedIn: 'root'
})
export class AcqReceiptService {

  // SERVICES ATTRIBUTES ======================================================
  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedReceiptSubject$: Subject<AcqReceipt> = new Subject();

  // GETTER AND SETTER ========================================================
  /** expose _deletedOrderLineSubject$ in 'readonly' mode */
  get deletedReceiptSubject$(): Observable<AcqReceipt> { return this._deletedReceiptSubject$.asObservable(); }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _acqReceiptApiService - AcqOrderApiService
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUIService
   * @param _translateService - TranslateService
   */
  constructor(
    private _acqReceiptApiService: AcqReceiptApiService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _translateService: TranslateService
  ) { }

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load a receipt from this pid
   * @param receiptPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getReceipt(receiptPid: string): Observable<AcqReceipt | null> {
    return this._acqReceiptApiService
      .getReceipt(receiptPid)
      .pipe(
        map((data: any) => new AcqReceipt(data.metadata))
      );
  }

  /**
   * Load all receipts related to an AcqOrder
   * @param orderPid: the pid of the parent AcqOrder
   * @return: the list of corresponding AcqReceipt
   */
  getReceiptsForOrder(orderPid: string): Observable<AcqReceipt[]> {
    const query = `acq_order.pid:${orderPid}`;
    return this._acqReceiptApiService
      .searchReceipts(query)
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => new AcqReceipt(hit.metadata)))
      );
  }

  /**
   * Allow to create a receipt from data.
   * @param record: the data to use to create the receipt
   * @return: the created AcqReceipt
   */
  createReceipt(record: any): Observable<AcqReceipt | null> {
    return this._acqReceiptApiService
      .createReceipt(record)
      .pipe(
        map((data: any) => new AcqReceipt(data.metadata))
      );
  }

  /**
   * Allow to update a receipt.
   * @param data: the receipt data. The `pid` key is required
   */
  updateReceipt(data: any): Observable<AcqReceipt | null> {
    return this._acqReceiptApiService.updateReceipt(data.pid, data).pipe(
      map((response: any) => new AcqReceipt(response.metadata))
    );
  }

  /**
   * Allow to delete an AcqReceipt.
   * If the order line is correctly deleted, this function emit an event:
   *   * deletedReceiptSubject$ : to specify which receipt has been deleted.
   * @param receipt: the receipt to delete
   */
  delete(receipt: AcqReceipt) {
    this._acqReceiptApiService
      .delete(receipt.pid)
      .subscribe((success: boolean) => {
          if (success) {
            this._deletedReceiptSubject$.next(receipt);
          }
        }
      );
  }

  // RECEIPT LINES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   * Allow to create receipt lines for a specific receipt
   * @param receiptPid: the parent receipt pid
   * @param lines: the lines data to create
   * @return: ...
   */
  createReceiptLines(receiptPid: string, lines: IAcqReceiptLine[]): Observable<ICreateLineMessage | null> {
    const generalErrorMessage = this._translateService.instant('Error proceeding receipt lines creation');
    return this._acqReceiptApiService
      .createReceiptLines(receiptPid, lines)
      .pipe(
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
        catchError((err) => of({success: false, messages: err.error.messages}))
      );
  }


}
