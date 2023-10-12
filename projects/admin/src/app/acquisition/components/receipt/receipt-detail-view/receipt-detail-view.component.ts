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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { RecordPermissions } from '../../../../classes/permissions';
import { RecordPermissionService } from '../../../../service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '../../../../utils/permissions';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqNote } from '../../../classes/common';
import { IAcqReceipt, IAcqReceiptLine } from '../../../classes/receipt';

@Component({
  selector: 'admin-receipt-detail-view',
  templateUrl: './receipt-detail-view.component.html',
  styleUrls: ['../../../acquisition.scss', './receipt-detail-view.component.scss']
})
export class ReceiptDetailViewComponent implements OnInit, OnDestroy, DetailRecord {

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
  private _subscriptions = new Subscription();


  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string|null  {
    if (!this.permissions.delete.can) {
      return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
    }
  }
  get editInfoMessage(): string|null {
    if (!this.permissions.update.can) {
      return this._recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'update');
    }
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _acqReceiptApiService - AcqReceiptApiService
   * @param _recordPermissionService - RecordPermissionService
   * @param _currentLibraryPermissionValidator - CurrentLibraryPermissionValidator
   */
  constructor(
    private _acqReceiptApiService: AcqReceiptApiService,
    private _recordPermissionService: RecordPermissionService,
    private _currentLibraryPermissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.record$.subscribe((record: any) => {
      this.receipt = {...this._acqReceiptApiService.receiptDefaultData, ...record.metadata};
      const receiptLines$ = this._acqReceiptApiService.getReceiptLines(this.receipt.pid);
      const permissions$ = this._recordPermissionService.getPermission(this.type, this.receipt.pid);
      forkJoin([receiptLines$, permissions$])
        .subscribe(([receiptLines, permissions]) => {
          this.receiptLines = receiptLines;
          this.permissions = this._currentLibraryPermissionValidator.validate(permissions, this.receipt.library.pid);
        });
    });
    this._subscriptions.add(
      this._acqReceiptApiService.deletedReceiptLineSubject$
        .subscribe((receiptLine) => this.receipt.receipt_lines = this.receipt.receipt_lines.filter(line => line.pid !== receiptLine.pid))
    );
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Allow to delete an receipt line
   * @param line - the receipt line to delete.
   */
  deleteReceiptLine(line: IAcqReceiptLine): void {
    this._acqReceiptApiService.deleteReceiptLine(line);
  }

  /**
   * extract receipt line notes from raw data record.
   * @param receiptLineRawData: the data to analyze.
   * @return the list of notes about this receiptLine.
   */
  getReceiptLinetNotes(receiptLineRawData: any|null): IAcqNote[] {
    return (receiptLineRawData && receiptLineRawData.metadata && receiptLineRawData.metadata.notes)
      ? receiptLineRawData.metadata.notes
      : [];
  }
}
