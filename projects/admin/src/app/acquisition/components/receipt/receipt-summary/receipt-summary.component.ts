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
import { Component, inject, Input, OnInit } from '@angular/core';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { forkJoin } from 'rxjs';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqReceipt } from '../../../classes/receipt';
import { ReceivedOrderPermissionValidator } from '../../../utils/permissions';

@Component({
  selector: 'admin-receipt-summary',
  templateUrl: './receipt-summary.component.html',
  styleUrls: ['../../../acquisition.scss', './receipt-summary.component.scss']
})
export class ReceiptSummaryComponent implements OnInit {

  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private currentLibraryPermissionValidator: CurrentLibraryPermissionValidator = inject(CurrentLibraryPermissionValidator);
  private receivedOrderPermissionValidator: ReceivedOrderPermissionValidator = inject(ReceivedOrderPermissionValidator);

  // COMPONENT ATTRIBUTES =====================================================
  /** The receipt pid to load */
  @Input() receiptPid: string;
  /** Is action button must be displayed */
  @Input() allowActions = false;
  /** Collapse detail configuration */
  @Input() collapsable = true;
  @Input() isCollapsed = true;
  /** Record permissions */
  @Input() recordPermissions?: RecordPermissions;
  /** Receipt object */
  receipt: IAcqReceipt = undefined;

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.recordPermissions.delete.can)
      ? this.recordPermissionService.generateDeleteMessage(this.recordPermissions.delete.reasons)
      : '';
  }
  get editInfoMessage(): string {
    return (!this.recordPermissions.update.can)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions.update.reasons, 'update')
      : '';
  }
  get resumeInfoMessage(): string {
    return (!this.recordPermissions.create.can)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions.create.reasons, 'resume')
      : '';
  }

  /** OnInit hook */
  ngOnInit(): void {
    if (!this.collapsable){
      this.isCollapsed = false;
    }
    // Disable actions if we don't have permissions.
    if (!this.recordPermissions) {
      this.allowActions = false;
    }
    this.acqReceiptApiService
      .getReceipt(this.receiptPid)
      .subscribe((receipt: IAcqReceipt) => {
        this.receipt = receipt;
        // Load permissions only if we need to display the action buttons
        if (this.allowActions) {
          const order$ = this.acqOrderApiService.getOrder(this.receipt.acq_order.pid);
          const permissions$ = this.recordPermissionService.getPermission('acq_receipts', this.receipt.pid);
          forkJoin([order$, permissions$]).subscribe(
            ([order, permissions]) => {
              this.recordPermissions = this.currentLibraryPermissionValidator.validate(permissions, this.receipt.library.pid);
              this.recordPermissions = this.receivedOrderPermissionValidator.validate(permissions, order);
            }
          );
        }
      });
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Delete a receipt */
  deleteReceipt(): void {
    this.acqReceiptApiService.delete(this.receipt);
  }
}
