// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { AcqOrderStatus } from '@app/admin/acquisition/classes/order';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqReceipt, IAcqReceiptLine } from '../../../classes/receipt';
import { validateReceivedOrderPermissions } from '../../../utils/permissions';
import { AppStore, OpenCloseButtonComponent, ActionButtonComponent } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ReceiptLineComponent } from '../receipt-line/receipt-line.component';
import { NotesComponent } from '../../notes/notes.component';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NoteBadgeColorPipe } from '../../../pipes/note-badge-color.pipe';
import { ReceptionDatesPipe } from '../../../pipes/reception-dates.pipe';

@Component({
    selector: 'admin-receipt-summary',
    templateUrl: './receipt-summary.component.html',
    imports: [OpenCloseButtonComponent, Bind, Tag, ActionButtonComponent, RouterLink, ReceiptLineComponent, NotesComponent, CurrencyPipe, I18nPluralPipe, TranslatePipe, NoteBadgeColorPipe, ReceptionDatesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptSummaryComponent {

  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** The receipt pid to load */
  receiptPid = input.required<string>();
  /** Is action button must be displayed */
  allowActions = input(false);
  /** Collapse detail configuration */
  collapsable = input(true);
  /** Record permissions */
  readonly recordPermissions = signal<RecordPermissions | undefined>(undefined);
  /** Receipt object */
  readonly receipt = signal<IAcqReceipt | undefined>(undefined);
  /** Is the detail collapsed */
  isCollapsed = true;
  validStatuses = [AcqOrderStatus.ORDERED, AcqOrderStatus.PARTIALLY_RECEIVED];

  constructor() {
    effect(() => {
      if (this.receiptPid()) {
        this.loadReceipt();
      }
      if (!this.collapsable()) {
        this.isCollapsed = false;
      }
    });

    effect(() => {
      const line = this.acqReceiptApiService.lastDeletedReceiptLine();
      if (line?.acq_receipt?.pid === untracked(() => this.receiptPid())) {
        this.loadReceipt();
      }
    });
  }

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.recordPermissions()?.delete?.can)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions()?.delete?.reasons, 'delete')
      : '';
  }

  loadReceipt() {
    this.acqReceiptApiService
      .getReceipt(this.receiptPid()).pipe(
        tap((receipt: IAcqReceipt) => {
          receipt.receipt_lines = receipt.receipt_lines.map((line:IAcqReceiptLine) => ({...line, ...{acq_receipt:{pid: this.receiptPid()}}}))
        }),
        tap((receipt: IAcqReceipt) => this.receipt.set(receipt)),
        switchMap(():Observable<any> => {
          // Load permissions only if we need to display the action buttons
          if (this.allowActions()) {
            return this.updatePermissions();
          }
          return of(null)
        })
      )
      .subscribe();
  }

  updatePermissions() {
    const order$ = this.acqOrderApiService.getOrder(this.receipt().acq_order.pid);
    const permissions$ = this.recordPermissionService.getPermission('acq_receipts', this.receipt().pid);
    return forkJoin([order$, permissions$]).pipe(
      tap(([order, permissions]) => {
        // modify permissions in place
        this.appStore.validateLibraryPermissions(permissions, this.receipt()?.library?.pid ?? '');
        this.recordPermissions.set(validateReceivedOrderPermissions(permissions, order));
      })
    );
  }

  /** Delete a receipt */
  deleteReceipt(): void {
    this.acqReceiptApiService.delete(this.receipt());
  }

}
