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
import { Component, OnInit } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-acquisition-order-detail-view',
  templateUrl: './order-detail-view.component.html',
  styleUrls: ['./order-detail-view.component.scss']
})
export class OrderDetailViewComponent implements OnInit, DetailRecord {

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** Acquisition Order total amount observable */
  totalAmount$: Observable<any>;
  /** Acquisition order Line observable */
  orderLines$: Observable<Array<any>>;

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
  ) { }

  /** OnInit hook */
  ngOnInit() {
    // init total amount
    this.totalAmount$ = this.record$.pipe(
      map(record => record.metadata.total_amount)
    );
    // retrieve all order lines linked
    this.orderLines$ = this.record$.pipe(
      switchMap(record => {
        const query = `acq_order.pid:${record.metadata.pid}`;
        return this._recordService.getRecords(
          'acq_order_lines', query, 1, RecordService.MAX_REST_RESULTS_SIZE,
          undefined, undefined, undefined, 'pid'
        ).pipe(
          map((result: Record) => result.hits.hits)
        );
      })
    );
  }

  // COMPONENT FUNCTIONS =======================================================
  /**
   * Delete order line event
   * @param orderLinePid - Order PID
   */
  deleteOrderLine(orderLinePid: string) {
    this._recordUiService.deleteRecord('acq_order_lines', orderLinePid).subscribe((success: any) => {
      if (success) {
        this.orderLines$ = this.orderLines$.pipe(
          map(orderLines =>
            orderLines.filter((orderLine: any) => orderLinePid !== orderLine.metadata.pid)
          )
        );
        this.totalAmount$ = this.record$.pipe(map(record => record.metadata.total_amount));
      }
    });
  }
}
