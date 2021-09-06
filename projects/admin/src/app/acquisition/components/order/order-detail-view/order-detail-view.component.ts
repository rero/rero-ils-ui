/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqNoteType, AcqOrder, AcqOrderLine } from '../../../classes/order';

@Component({
  selector: 'admin-acquisition-order-detail-view',
  templateUrl: './order-detail-view.component.html',
  styleUrls: ['./order-detail-view.component.scss']
})
export class OrderDetailViewComponent implements OnInit, OnDestroy, DetailRecord {

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** the order corresponding to the record */
  order: AcqOrder;
  /** Is order notes are collapsed */
  notesCollapsed = true;
  /** Acquisition order Line observable */
  orderLines$: Observable<Array<any>>;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param _acqOrderApiService - AcqOrderApiService,
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _scroller - ViewportScroller
   */
  constructor(
    private _acqOrderApiService: AcqOrderApiService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _scroller: ViewportScroller
  ) { }

  /** OnInit hook */
  ngOnInit() {
    // init total amount
    this.record$.subscribe(
      (record: any) => {
        this.order = new AcqOrder(record.metadata);
        const query = `acq_order.pid:${this.order.pid}`;
        this.orderLines$ = this._recordService.getRecords(
          'acq_order_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE,
          undefined, undefined, undefined, 'pid'
        ).pipe(
          map((result: Record) => result.hits.hits),
          map((hits: Array<any>) => hits.map(hit => new AcqOrderLine(hit.metadata)))
        );
      }
    );
    // Subscription when an order line is deleted
    this._subscriptions.add(
      this._acqOrderApiService.deletedOrderLineSubject$.subscribe((orderLine: AcqOrderLine) => this._deleteOrderLine(orderLine))
    );
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS =======================================================

  /** Scroll to an anchor
   *  @param e - the fired event
   *  @param anchorId - the anchor ID
   */
  scrollTo(e: Event, anchorId: string): void {
    e.preventDefault();
    this._scroller.scrollToAnchor(anchorId);
  }

  /** Get the badge color to use for a note type
   *  @param noteType - the note type
   */
  getBadgeColor(noteType: AcqNoteType): string {
    switch (noteType) {
      case AcqNoteType.STAFF_NOTE: return 'badge-info';
      case AcqNoteType.VENDOR_NOTE: return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  // COMPONENT PRIVATE FUNCTIONS ==============================================
  /**
   * Delete an order line
   * @param orderLine - The order line to remove
   */
  private _deleteOrderLine(orderLine: AcqOrderLine) {
    this.order.total_amount -= orderLine.total_amount;
    this.orderLines$ = this.orderLines$.pipe(
      map(orderLines => orderLines.filter((line: any) => line.pid !== orderLine.pid))
    );
  }

}
