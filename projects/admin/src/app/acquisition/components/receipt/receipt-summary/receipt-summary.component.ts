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
import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AcqOrderStatus } from '@app/admin/acquisition/classes/order';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { forkJoin, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqReceipt, IAcqReceiptLine } from '../../../classes/receipt';
import { ReceivedOrderPermissionValidator } from '../../../utils/permissions';

@Component({
    selector: 'admin-receipt-summary',
    templateUrl: './receipt-summary.component.html',
    standalone: false
})
export class ReceiptSummaryComponent implements OnChanges, OnInit, OnDestroy {

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
  recordPermissions?: RecordPermissions;
  /** Receipt object */
  receipt: IAcqReceipt = undefined;
  validStatuses = [AcqOrderStatus.ORDERED, AcqOrderStatus.PARTIALLY_RECEIVED];
 /** all component subscription */
  private subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.recordPermissions.delete.can)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions.delete.reasons, 'delete')
      : '';
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.subscriptions.add(
      this.acqReceiptApiService.deletedReceiptLineSubject$.subscribe(
        (receiptLine: IAcqReceiptLine) => {
      if(receiptLine.acq_receipt.pid === this.receiptPid) {
        this.loadReceipt();
      }
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(Object.hasOwn(changes, 'receiptPid') && changes.receiptPid) {
      this.loadReceipt();
    }
    if(Object.hasOwn(changes, 'collapsable') && changes.collapsable != null && !this.collapsable) {
      this.isCollapsed = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadReceipt() {
    this.acqReceiptApiService
      .getReceipt(this.receiptPid).pipe(
        tap((receipt: IAcqReceipt) => {
          receipt.receipt_lines = receipt.receipt_lines.map((line:IAcqReceiptLine) => ({...line, ...{acq_receipt:{pid: this.receiptPid}}}))
        }),
        tap((receipt: IAcqReceipt)=> this.receipt = receipt),
        switchMap(():Observable<any> => {
          // Load permissions only if we need to display the action buttons
          if (this.allowActions) {
            return this.updatePermissions();
          }
          return of(null)
        })
      )
      .subscribe();
  }

  updatePermissions() {
    const order$ = this.acqOrderApiService.getOrder(this.receipt.acq_order.pid);
    const permissions$ = this.recordPermissionService.getPermission('acq_receipts', this.receipt.pid);
    return forkJoin([order$, permissions$]).pipe(
      tap(([order, permissions]) => {
        // modify permissions in place
        this.currentLibraryPermissionValidator.validate(permissions, this.receipt.library.pid);
        this.recordPermissions = this.receivedOrderPermissionValidator.validate(permissions, order);
      })
    );
  }

  /** Delete a receipt */
  deleteReceipt(): void {
    this.acqReceiptApiService.delete(this.receipt);
  }

}
