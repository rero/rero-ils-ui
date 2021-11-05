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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AcqOrder, AcqOrderLine, AcqOrderLineStatus, AcqOrderStatus } from '../../../classes/order';
import { AcqOrderService } from '../../../services/acq-order.service';

@Component({
  selector: 'admin-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  // COMPONENTS ATTRIBUTES ====================================================
  @Input() order: AcqOrder;

  /** reference to AcqOrderStatus class */
  acqOrderStatus = AcqOrderStatus;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // CONSTRUCTOR & HOOKS ======================================================

  /**
   * Constructor
   * @param _acqOrderService - AcqOrderService
   */
  constructor(
    private _acqOrderService: AcqOrderService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    // Subscription when an order line is deleted
    this._subscriptions.add(
      this._acqOrderService.deletedOrderLineSubject$.subscribe((orderLine: AcqOrderLine) => {
        if (orderLine.status !== AcqOrderLineStatus.CANCELLED) {
          this.order.total_amount -= orderLine.total_amount;
          this.order.item_quantity.ordered -= orderLine.quantity;
          this.order.item_quantity.received -= orderLine.quantity_received;
        }
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }


}
