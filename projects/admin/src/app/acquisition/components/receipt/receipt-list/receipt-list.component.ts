/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { AcqOrderStatus, IAcqOrder } from '../../../classes/order';
import { IAcqReceipt } from '../../../classes/receipt';
import { ReceivedOrderPermissionValidator } from '../../../utils/permissions';

@Component({
    selector: 'admin-receipt-list',
    templateUrl: './receipt-list.component.html',
    standalone: false
})
export class ReceiptListComponent implements OnChanges, OnDestroy {

  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private currentLibraryPermissionValidator: CurrentLibraryPermissionValidator = inject(CurrentLibraryPermissionValidator);
  private receivedOrderPermissionValidator: ReceivedOrderPermissionValidator = inject(ReceivedOrderPermissionValidator);

  // COMPONENT ATTRIBUTES =====================================================
  /** the order for which we want to display receipts */
  @Input() order: IAcqOrder;
  /** AcqReceipt to display */
  receipts: IAcqReceipt[] = undefined;

  public recordPermissions: any;

  /** all component subscription */
  private subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get createInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.recordPermissions.create.reasons);
  }

  canAdd(): boolean {
    return [AcqOrderStatus.PARTIALLY_RECEIVED, AcqOrderStatus.ORDERED].some(status => status == this.order.status);
  }

  /**
   * Get the number of loaded receipts
   * @return: the number of loaded receipts
   */
  get numberOfReceipt(): number {
    return (this.receipts) ? this.receipts.length : 0;
  }

  /** OnChanges hook */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('order')) {
      this.loadPermissions();
      this._loadReceipts();
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // PRIVATE COMPONENT METHODS ================================================
  /** load receipts related to an order */
  private _loadReceipts(): void {
    this.acqReceiptApiService
      .getReceiptsForOrder(this.order.pid)
      .subscribe((receipts: IAcqReceipt[]) => this.receipts = receipts);
  }

  /**
   * Load and complete permissions related to an order.
   * Permissions about receipt must be completed regarding the current user library and the order status.
   */
  private loadPermissions(): void {
    this.subscriptions.add(this.recordPermissionService
      .getPermission('acq_orders', this.order.pid)
      .pipe(
        map(permissions => this.currentLibraryPermissionValidator.validate(permissions, this.order.library.pid)),
        map(permissions => this.receivedOrderPermissionValidator.validate(permissions, this.order))
      ).subscribe((permissions: any) => this.recordPermissions = permissions));
  }
}
