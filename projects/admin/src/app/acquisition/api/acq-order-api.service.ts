/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { IPreview } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Record, RecordService, RecordUiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../../classes/notification';
import {
  AcqAddressRecipient,
  AcqOrderHistoryVersionResponseInterface,
  IAcqOrder,
  IAcqOrderLine,
  orderDefaultData,
  orderLineDefaultData
} from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderApiService extends BaseApi {

  private httpClient: HttpClient = inject(HttpClient);
  private recordService: RecordService = inject(RecordService);
  private recordUiService: RecordUiService = inject(RecordUiService);

  // SERVICES ATTRIBUTES ======================================================

  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedOrderLineSubject$ = new Subject<IAcqOrderLine>();

  // GETTER AND SETTER ========================================================
  /** expose _deletedOrderLineSubject$ in 'readonly' mode */
  get deletedOrderLineSubject$(): Observable<IAcqOrderLine> { return this._deletedOrderLineSubject$.asObservable(); }

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load an order from this pid
   * @param orderPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getOrder(orderPid: string, resolve=0): Observable<IAcqOrder> {
    return this.recordService.getRecord('acq_orders', orderPid, resolve, BaseApi.reroJsonheaders).pipe(
        map(data => ({...orderDefaultData, ...data.metadata}) )
      );
  }

  /**
   * Get an order preview.
   * @param orderPid: the order pid
   */
  getOrderPreview(orderPid: string): Observable<IPreview> {
    const apiUrl = `/api/acq_order/${orderPid}/acquisition_order/preview`;
    return this.httpClient.get<any>(apiUrl);
  }

  /**
   * Validate and send an order.
   * @param orderPid: the order pid
   * @param emails: the recipients emails address
   */
  sendOrder(orderPid: string, emails: AcqAddressRecipient[]): Observable<Notification> {
    const apiUrl = `/api/acq_order/${orderPid}/send_order`;
    return this.httpClient.post<any>(apiUrl, {emails}).pipe(
      map((data: any) => new Notification(data.data))
    );
  }

  getOrderHistory(orderPid: string): Observable<AcqOrderHistoryVersionResponseInterface[]> {
    const apiUrl = `/api/acq_order/${orderPid}/history`;
    return this.httpClient
        .get<AcqOrderHistoryVersionResponseInterface[]>(apiUrl);
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
    return this.recordService
      .getRecords('acq_order_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE, undefined, undefined, undefined, 'priority')
      .pipe(
        map((result: Record) => this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...orderLineDefaultData, ...hit.metadata})))
      );
  }

  /**
   * Allow to delete an order line.
   * If the order line is correctly deleted, this function emit an event :
   *   * deletedOrderLineSubject$ : to specify which order line has been deleted
   * @param orderLine: the order line to delete
   */
  deleteOrderLine(orderLine: IAcqOrderLine): void {
    this.recordUiService
      .deleteRecord('acq_order_lines', orderLine.pid)
      .subscribe((success: boolean) => {
          if (success) {
            this._deletedOrderLineSubject$.next(orderLine);
          }
        }
      );
  }
}
