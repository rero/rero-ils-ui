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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { RecordPermissions } from '../../../../classes/permissions';
import { RecordPermissionService } from '../../../../service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '../../../../utils/permissions';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqReceipt, IAcqReceiptLine } from '../../../classes/receipt';

@Component({
  selector: 'admin-receipt-detail-view',
  templateUrl: './receipt-detail-view.component.html',
  styleUrls: ['../../../acquisition.scss', './receipt-detail-view.component.scss']
})
export class ReceiptDetailViewComponent implements OnInit, OnDestroy, DetailRecord {

  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private currentLibraryPermissionValidator: CurrentLibraryPermissionValidator = inject(CurrentLibraryPermissionValidator);

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** the receipt corresponding to the record */
  receipt: IAcqReceipt;
  /** record permissions */
  permissions: RecordPermissions;
  /** receipt lines related to this receipt */
  receiptLines: IAcqReceiptLine[] = [];

  /** all component subscription */
  private subscriptions = new Subscription();


  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string|null  {
    if (!this.permissions.delete.can) {
      return this.recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
    }
  }
  get editInfoMessage(): string|null {
    if (!this.permissions.update.can) {
      return this.recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'update');
    }
  }

  /** OnInit hook */
  ngOnInit() {
    this.record$.subscribe((record: any) => {
      this.receipt = {...this.acqReceiptApiService.receiptDefaultData, ...record.metadata};
      const receiptLines$ = this.acqReceiptApiService.getReceiptLines(this.receipt.pid);
      const permissions$ = this.recordPermissionService.getPermission(this.type, this.receipt.pid);
      forkJoin([receiptLines$, permissions$])
        .subscribe(([receiptLines, permissions]) => {
          this.receiptLines = receiptLines;
          this.permissions = this.currentLibraryPermissionValidator.validate(permissions, this.receipt.library.pid);
        });
    });
    this.subscriptions.add(
      this.acqReceiptApiService.deletedReceiptLineSubject$
        .subscribe((receiptLine) => this.receipt.receipt_lines = this.receipt.receipt_lines.filter(line => line.pid !== receiptLine.pid))
    );
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Allow to delete an receipt line
   * @param line - the receipt line to delete.
   */
  deleteReceiptLine(line: IAcqReceiptLine): void {
    this.acqReceiptApiService.deleteReceiptLine(line);
  }
}
