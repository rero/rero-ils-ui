// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IPreview } from '@app/admin/shared/preview-email/IPreviewInterface';
import type { EsResult } from '@rero/ng-core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
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

  /** Last deleted order line (null = no deletion yet) */
  readonly lastDeletedOrderLine = signal<IAcqOrderLine | null>(null);

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load an order from this pid
   * @param orderPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getOrder(orderPid: string, resolve=0): Observable<IAcqOrder> {
    return this.recordService.getRecord('acq_orders', orderPid, { resolve, headers: BaseApi.reroJsonheaders }).pipe(
        map((data: any) => ({...orderDefaultData, ...data.metadata}) as IAcqOrder)
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
      .getRecords('acq_order_lines', {
        query,
        page: 1,
        itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
        sort: 'priority'
      })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map(hit => ({...orderLineDefaultData, ...hit.metadata})))
      );
  }

  /**
   * Allow to delete an order line.
   * @param orderLine: the order line to delete
   */
  deleteOrderLine(orderLine: IAcqOrderLine): void {
    this.recordUiService
      .deleteRecord('acq_order_lines', orderLine.pid)
      .subscribe((success: boolean) => {
          if (success) {
            this.lastDeletedOrderLine.set(orderLine);
          }
        }
      );
  }
}
