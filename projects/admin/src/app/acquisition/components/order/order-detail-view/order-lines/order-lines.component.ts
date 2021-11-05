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
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { AcqOrder, AcqOrderLine } from '../../../../classes/order';
import { AcqOrderService } from '../../../../services/acq-order.service';

@Component({
  selector: 'admin-order-lines',
  templateUrl: './order-lines.component.html'
})
export class OrderLinesComponent implements OnInit, OnChanges, OnDestroy {

  // COMPONENTS ATTRIBUTES ====================================================
  /** Acquisition order pid */
  @Input() order: AcqOrder;
  /** record permissions */
  @Input() permissions?: RecordPermissions;
  /** Acquisition order Line observable */
  orderLines: AcqOrderLine[] = undefined;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get createInfoMessage(): string {
    return this._recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'create');
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _acqOrderService - AcqOrderService
   * @param _recordPermissionService - RecordPermissionService
   * @param _permissionValidator - CurrentLibraryPermissionValidator
   */
  constructor(
    private _acqOrderService: AcqOrderService,
    private _recordPermissionService: RecordPermissionService,
    private _permissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    if (this.permissions === undefined) {
      this._recordPermissionService.getPermission('acq_orders', this.order.pid)
        .pipe(map(permissions => this._permissionValidator.validate(permissions, this.order.library.pid)))
        .subscribe((permissions) => this.permissions = permissions);
    }
    this._loadOrderLines();
    this._subscriptions.add(
      this._acqOrderService.deletedOrderLineSubject$.subscribe((orderLine: AcqOrderLine) => {
        this.orderLines = this.orderLines.filter((line: AcqOrderLine) => line.pid !== orderLine.pid);
      })
    );
  }

  /** OnChanges hook */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('order')) {
      this._loadOrderLines();
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  // PRIVATE COMPONENT METHODS ================================================
  /** load order lines related to this order */
  private _loadOrderLines(): void {
    this._acqOrderService.getOrderLines(this.order.pid).subscribe((lines: AcqOrderLine[]) => this.orderLines = lines);
  }
}
