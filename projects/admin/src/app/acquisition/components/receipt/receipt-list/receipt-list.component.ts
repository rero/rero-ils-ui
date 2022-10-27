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
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqOrder } from '../../../classes/order';
import { IAcqReceipt } from '../../../classes/receipt';
import { ReceivedOrderPermissionValidator } from '../../../utils/permissions';

@Component({
  selector: 'admin-receipt-list',
  templateUrl: './receipt-list.component.html'
})
export class ReceiptListComponent implements OnInit, OnChanges, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** the order for which we want to display receipts */
  @Input() order: IAcqOrder;
  /** the permissions about the related order */
  @Input() recordPermissions?: RecordPermissions = null;
  /** AcqReceipt to display */
  receipts: IAcqReceipt[] = undefined;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get createInfoMessage(): string {
    return this._recordPermissionService.generateTooltipMessage(this.recordPermissions.create.reasons, 'create');
  }

  /**
   * Get the number of loaded receipts
   * @return: the number of loaded receipts
   */
  get numberOfReceipt(): number {
    return (this.receipts) ? this.receipts.length : 0;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _acqReceiptApiService - AcqReceiptApiService
   * @param _recordPermissionService - RecordPermissionService
   * @param _currentLibraryPermissionValidator - CurrentLibraryPermissionValidator
   * @param _receivedOrderPermissionValidator - ReceivedOrderPermissionValidator
   */
  constructor(
    private _acqReceiptApiService: AcqReceiptApiService,
    private _recordPermissionService: RecordPermissionService,
    private _currentLibraryPermissionValidator: CurrentLibraryPermissionValidator,
    private _receivedOrderPermissionValidator: ReceivedOrderPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._loadPermissions();
    this._loadReceipts();
    this._subscriptions.add(
      this._acqReceiptApiService.deletedReceiptSubject$.subscribe((deletedReceipt: IAcqReceipt) => {
        this.receipts = this.receipts.filter((receipt: IAcqReceipt) => receipt.pid !== deletedReceipt.pid);
      })
    );
  }

  /** OnChanges hook */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('order')) {
      this._loadReceipts();
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  // PRIVATE COMPONENT METHODS ================================================
  /** load receipts related to an order */
  private _loadReceipts(): void {
    this._acqReceiptApiService
      .getReceiptsForOrder(this.order.pid)
      .subscribe((receipts: IAcqReceipt[]) => this.receipts = receipts);
  }

  /**
   * Load and complete permissions related to an order.
   * Permissions about receipt must be completed regarding the current user library and the order status.
   */
  private _loadPermissions(): void {
    if (this.recordPermissions) {
      const permissions$ = this.recordPermissions
        ? of(this.recordPermissions)
        : this._recordPermissionService.getPermission('acq_orders', this.order.pid);
      const obsPermissions = permissions$
        .pipe(
          map(permissions => this._currentLibraryPermissionValidator.validate(permissions, this.order.library.pid)),
          map(permissions => this._receivedOrderPermissionValidator.validate(permissions, this.order))
        )
        .subscribe((permissions) => this.recordPermissions = permissions);
      this._subscriptions.add(obsPermissions);
      }
    }
}
