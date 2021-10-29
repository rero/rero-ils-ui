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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApi } from '../../../../../shared/src/lib/api/base-api';
import { IAcqReceiptLine } from '../classes/receipt';
import { IResponseReceiptLine } from '../components/receipt/receipt-form/order-receipt';

@Injectable({
  providedIn: 'root'
})
export class AcqReceiptApiService {

  /** default options to get records */
  private readonly _defaultRecordOptions = {
    headers: { Accept: 'application/json'},
    sort: 'name'
  };

  /** The resource name for an acquisition receipt */
  resourceName = 'acq_receipts';

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _http - HttpClient
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _http: HttpClient
  ) {}

  // READ/LIST FUNCTIONS ======================================================
  /**
   * Get acquisition receipt record.
   * @param pid - the receipt pid to search.
   * @returns ElasticSearch response for this receipt or null if error occurred.
   */
  getReceipt(pid: string): Observable<any|null> {
    return this._recordService
      .getRecord(this.resourceName, pid, 1, BaseApi.reroJsonheaders)
      .pipe(
        catchError(() => of(null))
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
  }): Observable<any|null> {
    options = {...this._defaultRecordOptions, ...options};  // add some default params
    return this._recordService
      .getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, options.headers, options.sort);
  }


  // CREATE FUNCTIONS =========================================================
  /**
   * Create acquisition receipt record.
   * @param record - the receipt data to create
   * @returns created receipt data if success or null if failed
   */
  createReceipt(record: any): Observable<any|null> {
    return this._recordService
      .create(this.resourceName, record)
      .pipe(
        catchError(() => of(null))
      );
  }

  /**
   * Create acquisition reception lines.
   * @param receiptPid - the parent receipt pid which lines will be attached.
   * @param lines - reception lines data to create.
   * @returns the API response about create lines.
   */
  createReceiptLines(receiptPid: string, lines: IAcqReceiptLine[]): Observable<IResponseReceiptLine[]|null> {
    const url = `/api/acq_receipt/${receiptPid}/lines`;
    return this._http
      .post<any>(url, lines)
      .pipe(
        map((response: IResponseReceiptLine) => response.response),
        catchError(() => of(null))
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
    return this._recordService.update(this.resourceName, receiptPid, record);
  }

  // DELETE FUNCTIONS ========================================================
  /**
   * Delete acquisition receipt record.
   * @param receiptPid - the receipt pid.
   * @returns the response of the API call
   */
  delete(receiptPid: string): Observable<boolean> {
    return this._recordUiService.deleteRecord(this.resourceName, receiptPid);
  }


}
