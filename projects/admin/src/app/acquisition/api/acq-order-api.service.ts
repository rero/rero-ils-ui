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
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqOrder, AcqOrderLine } from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderApiService {

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name of acquisition account */
  resourceName = 'acq_orders';

  /** Subject emitted when an order line is deleted. The order line pid will be emitted */
  private _deletedOrderLineSubject$: Subject<AcqOrderLine> = new Subject();
  /** already loaded order */
  private _knownOrders: Array<AcqOrder> = [];

  // GETTER AND SETTER ========================================================
  get deletedOrderLineSubject$(): Observable<AcqOrderLine> { return this._deletedOrderLineSubject$.asObservable(); }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
  ) { }

  // SERVICE PUBLIC FUNCTIONS =================================================

  /**
   * Get an order based on its pid.
   * @param pid: the order pid
   * @return Observable the corresponding AcqOrder object
   */
  getOrder(pid: string): Observable<AcqOrder> {
    return this._recordService.getRecord(this.resourceName, pid).pipe(
      map((record: any) => {
        const acqOrder = new AcqOrder(record.metadata);
        this._addKnownOrder(acqOrder);
        return acqOrder;
      })
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

  // SERVICE PRIVATE FUNCTIONS ================================================

  /**
   * Allow to add an order in the list of knownOrder
   * @param order: the order to add.
   */
  private _addKnownOrder(order: AcqOrder) {
    const idx = this._knownOrders.findIndex((o) => o.pid === order.pid);
    if (idx >= 0) {
      this._knownOrders[idx] = order;
    } else {
      this._knownOrders.push(order);
    }
  }
}
