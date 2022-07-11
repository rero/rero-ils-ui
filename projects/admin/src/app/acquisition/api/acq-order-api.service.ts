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
import { Record, RecordService, RecordUiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../../classes/notification';
import {
  AcqAddressRecipient,
  AcqOrderLineStatus,
  AcqOrderStatus,
  AcqOrderType,
  IAcqOrder,
  IAcqOrderLine,
  IAcqOrderPreviewResponse
} from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderApiService extends BaseApi {

  // SERVICES ATTRIBUTES ======================================================

  /** Default values */
  public readonly orderDefaultData = {
    priority: 0,
    type: AcqOrderType.MONOGRAPH,
    status: AcqOrderStatus.PENDING,
    notes: []
  };
  public readonly orderLineDefaultData = {
    status: AcqOrderLineStatus.APPROVED,
    priority: 0,
    quantity: 0,
    received_quantity: 0,
    amount: 0,
    total_amount: 0,
    exchange_rate: 0,
    notes: []
  };

  // SERVICES ATTRIBUTES ======================================================
  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedOrderLineSubject$: Subject<IAcqOrderLine> = new Subject();

  // GETTER AND SETTER ========================================================
  /** expose _deletedOrderLineSubject$ in 'readonly' mode */
  get deletedOrderLineSubject$(): Observable<IAcqOrderLine> { return this._deletedOrderLineSubject$.asObservable(); }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _http - HttpClient
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService
  ) {
    super();
  }

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load an order from this pid
   * @param orderPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getOrder(orderPid: string): Observable<IAcqOrder> {
    return this._recordService.getRecord('acq_orders', orderPid, 0, BaseApi.reroJsonheaders).pipe(
        map(data => ({...this.orderDefaultData, ...data.metadata}) )
      );
  }

  /**
   * Get an order preview.
   * @param orderPid: the order pid
   */
  getOrderPreview(orderPid: string): Observable<IAcqOrderPreviewResponse> {
    const apiUrl = `/api/acq_order/${orderPid}/acquisition_order/preview`;
    return this._http.get<IAcqOrderPreviewResponse>(apiUrl);
  }

  /**
   * Validate and send an order.
   * @param orderPid: the order pid
   * @param emails: the recipients emails address
   */
  sendOrder(orderPid: string, emails: AcqAddressRecipient[]): Observable<Notification> {
    const apiUrl = `/api/acq_order/${orderPid}/send_order`;
    return this._http.post<any>(apiUrl, {emails}).pipe(
      map((data: any) => new Notification(data.data))
    );
  }

  // ORDER LINES RELATED METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   * Get order lines related to an order
   * @param orderPid: the order pid
   * @param extraQuery: add some elements on query
   */
  getOrderLines(orderPid: string, extraQuery?: string): Observable<IAcqOrderLine[]> {
    let query = `acq_order.pid:${orderPid}`;
    if (extraQuery) {
      query += ` ${extraQuery}`;
    }
    return this._recordService
      .getRecords('acq_order_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, 'priority')
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...this.orderDefaultData, ...hit.metadata}) ))
      );
  }

  /**
   * Allow to delete an order line.
   * If the order line is correctly deleted, this function emit an event :
   *   * deletedOrderLineSubject$ : to specify which order line has been deleted
   * @param orderLine: the order line to delete
   */
  deleteOrderLine(orderLine: IAcqOrderLine): void {
    this._recordUiService
      .deleteRecord('acq_order_lines', orderLine.pid)
      .subscribe((success: boolean) => {
          if (success) {
            this._deletedOrderLineSubject$.next(orderLine);
          }
        }
      );
  }
}
