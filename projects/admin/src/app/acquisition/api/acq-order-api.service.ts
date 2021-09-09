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
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqAddressRecipient, AcqOrder, AcqOrderLine, AcqOrderPreview } from '../classes/order';
import { Notification } from '../../classes/notification';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderApiService {

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name of acquisition account */
  resourceName = 'acq_orders';

  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedOrderLineSubject$: Subject<AcqOrderLine> = new Subject();

  // GETTER AND SETTER ========================================================
  /** expose _deletedOrderLineSubject$ in 'readonly' mode */
  get deletedOrderLineSubject$(): Observable<AcqOrderLine> { return this._deletedOrderLineSubject$.asObservable(); }

  // CONSTRUCTOR ==============================================================
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
  ) { }

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load an order from this pid
   * @param orderPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getOrder(orderPid: string): Observable<AcqOrder> {
    const apiUrl = `/api/${this.resourceName}/${orderPid}`;
    return this._http.get<any>(apiUrl).pipe(
      map((data: any) => new AcqOrder(data.metadata))
    );
  }

  /**
   * Get an order preview.
   * @param orderPid: the order pid
   */
  getOrderPreview(orderPid: string): Observable<AcqOrderPreview> {
    const apiUrl = `/api/acq_order/${orderPid}/acquisition_order/preview`;
    return this._http.get<any>(apiUrl).pipe(
      map((data: any) => new AcqOrderPreview(data))
    );
  }

  /**
   * Validate and send an order.
   * @param orderPid: the order pid
   * @param emails: the recipients emails address
   */
  sendOrder(orderPid: string, emails: Array<AcqAddressRecipient>): Observable<any> {
    const apiUrl = `/api/acq_order/${orderPid}/send_order`;
    return this._http.post<any>(apiUrl, {emails}).pipe(
      map((data: any) => new Notification(data.data))
    );

  }


  // ORDER LINES RELATED METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Get order lines related to an order
   * @param orderPid: the order pid
   * @return: an Observable of order lines
   */
  getOrderLines(orderPid: string): Observable<Array<AcqOrderLine>> {
    const query = `acq_order.pid:${orderPid}`;
    return this._recordService
      .getRecords('acq_order_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, 'priority')
      .pipe(
        map((result: Record) => result.hits.hits),
        map((hits: Array<any>) => hits.map(hit => new AcqOrderLine(hit.metadata)))
      );
  }

  /**
   * Allow to delete an order line based on its pid.
   * If the order line is correctly deleted, this function emit 2 events:
   *   * deletedOrderLineSubject$ : to specify which order line has been deleted.
   *   * orderTotalAmountChanged$ : to specify the new parent order total amount
   * @param orderLine: the order to delete
   */
  deleteOrderLine(orderLine: AcqOrderLine) {
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
