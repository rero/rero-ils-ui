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
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { IAcqReceipt } from '../../../classes/receipt';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
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
  @Input() permissions?: RecordPermissions;
  /** Receipt object */
  receipt: IAcqReceipt = undefined;

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.permissions.delete.can)
      ? this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons)
      : '';
  }
  get editInfoMessage(): string {
    return (!this.permissions.update.can)
      ? this._recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'update')
      : '';
  }
  get resumeInfoMessage(): string {
    return (!this.permissions.create.can)
      ? this._recordPermissionService.generateTooltipMessage(this.permissions.create.reasons, 'resume')
      : '';
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _recordPermissionService - RecordPermissionService
   * @param _acqReceiptApiService - AcqReceiptApiService
   * @param _acqOrderApiService - AcqOrderApiService
   * @param _currentLibraryPermissionValidator - CurrentLibraryPermissionValidator
   * @param _receivedOrderPermissionValidator - ReceivedOrderPermissionValidator
   */
  constructor(
    private _recordPermissionService: RecordPermissionService,
    private _acqReceiptApiService: AcqReceiptApiService,
    private _acqOrderApiService: AcqOrderApiService,
    private _currentLibraryPermissionValidator: CurrentLibraryPermissionValidator,
    private _receivedOrderPermissionValidator: ReceivedOrderPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    if (!this.collapsable){
      this.isCollapsed = false;
    }
    // Disable actions if we don't have permissions.
    if (!this.permissions) {
      this.allowActions = false;
    }
    this._acqReceiptApiService
      .getReceipt(this.receiptPid)
      .subscribe((receipt: IAcqReceipt) => {
        this.receipt = receipt;
        // Load permissions only if we need to display the action buttons
        if (this.allowActions) {
          const order$ = this._acqOrderApiService.getOrder(this.receipt.acq_order.pid);
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
    this._acqReceiptApiService.delete(this.receipt);
  }
}
