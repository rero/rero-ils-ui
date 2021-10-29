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
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { AcqReceipt } from '../../../classes/receipt';
import { AcqOrderService } from '../../../services/acq-order.service';
import { AcqReceiptService } from '../../../services/acq-receipt.service';
import { ReceivedOrderPermissionValidator } from '../../../utils/permissions';

@Component({
  selector: 'admin-receipt-summary',
  templateUrl: './receipt-summary.component.html',
  styleUrls: ['../../../acquisition.scss', './receipt-summary.component.scss']
})
export class ReceiptSummaryComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** The receipt pid to load */
  @Input() receiptPid: string;
  /** Is action button must be displayed */
  @Input() allowActions = false;
  /** Collapse detail configuration */
  @Input() collapsable = true;
  @Input() isCollapsed = true;
  /** Record permissions */
  permissions: RecordPermissions;
  /** Receipt object */
  receipt: AcqReceipt = undefined;

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }
  get editInfoMessage(): string {
    return this._recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'update');
  }
  get resumeInfoMessage(): string {
    return this._recordPermissionService.generateTooltipMessage(this.permissions.create.reasons, 'resume');
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _recordPermissionService - RecordPermissionService
   * @param _acqReceiptService - AcqReceiptService
   * @param _acqOrderService - AcqOrderService
   * @param _currentLibraryPermissionValidator - CurrentLibraryPermissionValidator
   * @param _receivedOrderPermissionValidator - ReceivedOrderPermissionValidator
   */
  constructor(
    private _recordPermissionService: RecordPermissionService,
    private _acqReceiptService: AcqReceiptService,
    private _acqOrderService: AcqOrderService,
    private _currentLibraryPermissionValidator: CurrentLibraryPermissionValidator,
    private _receivedOrderPermissionValidator: ReceivedOrderPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    if (!this.collapsable){
      this.isCollapsed = false;
    }
    this._acqReceiptService
      .getReceipt(this.receiptPid)
      .subscribe((receipt: AcqReceipt) => {
        this.receipt = receipt;
        // Load permissions only if we need to display the action buttons
        if (this.allowActions) {
          const order$ = this._acqOrderService.getOrder(this.receipt.acq_order.pid);
          const permissions$ = this._recordPermissionService.getPermission('acq_receipts', this.receipt.pid);
          forkJoin([order$, permissions$]).subscribe(
            ([order, permissions]) => {
              this.permissions = this._currentLibraryPermissionValidator.validate(permissions, this.receipt.library.pid);
              this.permissions = this._receivedOrderPermissionValidator.validate(permissions, order);
            }
          );
        }
      });
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Delete a receipt */
  deleteReceipt(): void {
    this._acqReceiptService.delete(this.receipt);
  }
}
