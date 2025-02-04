/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqOrderStatus, IAcqOrder, IAcqOrderLine } from '../../../../classes/order';
import { UserService } from '@rero/shared';

@Component({
  selector: 'admin-order-lines',
  templateUrl: './order-lines.component.html'
})
export class OrderLinesComponent implements OnInit, OnChanges, OnDestroy {

  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private userService : UserService = inject(UserService);

  // COMPONENTS ATTRIBUTES ====================================================
  /** Acquisition order pid */
  @Input() order: IAcqOrder;
  /** Acquisition order lines to display */
  orderLines: IAcqOrderLine[] = undefined;

  /** all component subscription */
  private subscriptions = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
    this.loadOrderLines();
    this.subscriptions.add(
      this.acqOrderApiService
        .deletedOrderLineSubject$
        .subscribe(
          (orderLine: IAcqOrderLine) => this.orderLines = this.orderLines.filter((line: IAcqOrderLine) => line.pid !== orderLine.pid)
        )
    );
  }

  canAdd(): boolean {
    // rollover
    if (!this.order.is_current_budget) {
      return false;
    }
    // owning library
    if (this.userService.user.currentLibrary !== this.order.library.pid) {
      return false;
    }
    // order status
    return [AcqOrderStatus.PENDING, AcqOrderStatus.CANCELLED].some(status => status == this.order.status);
  }

  /** OnChanges hook */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('order')) {
      this.loadOrderLines();
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // PRIVATE COMPONENT METHODS ================================================
  /** load order lines related to this order */
  private loadOrderLines(): void {
    this.acqOrderApiService
      .getOrderLines(this.order.pid)
      .subscribe((lines: IAcqOrderLine[]) => this.orderLines = lines);
  }
}
