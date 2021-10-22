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
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IReceiptOrder } from '../classes/receipt';
import { IReceiptLine, IReceiptOrderLine, IResponseReceiptLine } from '../components/order/order-receipt-view/order-receipt';

@Injectable({
  providedIn: 'root'
})
export class AcqReceiptApiService {

  /** Resource name */
  private _resource = 'acq_receipts';

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _http - HttpClient
   */
  constructor(
    private _recordService: RecordService,
    private _http: HttpClient
    ) {}

  /**
   * Get receipt record
   * @param pid - string
   * @returns Observable
   */
  getReceipt(pid: string): Observable<IReceiptOrder | null> {
    return this._recordService.getRecord(this._resource, pid).pipe(
      map((result: any) => result.metadata),
      catchError(() => of(null))
    );
  }

  /**
   * Create receipt record
   * @param record - data
   * @returns Observable
   */
  createReceipt(record: any): Observable<IReceiptOrder | null> {
    return this._recordService.create(this._resource, record).pipe(
      map((result: any) => result.metadata),
      catchError(() => of(null))
    );
  }

  /**
   * Update receipt record
   * @param pid - string
   * @param record - data
   * @returns Observable
   */
  updateReceipt(pid: string, record: any): Observable<IReceiptOrder | null> {
    return this._recordService.update(this._resource, pid, record).pipe(
      map((result: any) => result.metadata),
      catchError(() => of(null))
    );
  }

  /**
   * Create receipt order lines
   * @param lines - array of ReceiptOrderLine
   * @returns Observable
   */
  createReceiptLines(receiptPid: string, lines: IReceiptOrderLine[]): Observable<IReceiptLine[] | null> {
    const url = `/api/acq_receipt/${receiptPid}/lines`;
    return this._http.post<any>(url, lines).pipe(
      map((response: IResponseReceiptLine) => response.response),
      catchError(() => of(null))
    );
  }
}
