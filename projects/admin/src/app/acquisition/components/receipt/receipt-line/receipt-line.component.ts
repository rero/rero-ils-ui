// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AcqReceiptApiService } from '@app/admin/acquisition/api/acq-receipt-api.service';
import { IAcqReceipt, IAcqReceiptLine } from '@app/admin/acquisition/classes/receipt';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe } from '@rero/ng-core';
import { ActionButtonComponent, AppStore, DocumentBriefViewComponent } from '@rero/shared';
import { catchError, map, of, switchMap } from 'rxjs';

import { ReceiptLineTotalAmountPipe } from '../../../pipes/receipt-line-total-amount.pipe';

@Component({
  selector: 'admin-receipt-line',
  templateUrl: './receipt-line.component.html',
  imports: [
    DocumentBriefViewComponent,
    ActionButtonComponent,
    RouterLink,
    AsyncPipe,
    CurrencyPipe,
    GetRecordPipe,
    TranslatePipe,
    ReceiptLineTotalAmountPipe,
  ],
})
export class ReceiptLineComponent {
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private appStore = inject(AppStore);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private documentApiService: DocumentApiService = inject(DocumentApiService);

  line = input<IAcqReceiptLine>();
  receipt = input<IAcqReceipt>();
  allowActions = input<boolean>();

  /** Record permissions */
  permissions = toSignal<RecordPermissions>(toObservable(this.line).pipe(switchMap(() => this.updatePermissions())));

  /** Document state: the record when found, or a notFound flag when the linked document no longer exists */
  document = toSignal(
    toObservable(this.line).pipe(
      switchMap((line) => {
        if (!line?.document?.pid) {
          return of({ record: null, notFound: false });
        }
        return this.documentApiService.getDocument(line.document.pid).pipe(
          map((record) => ({ record, notFound: false })),
          catchError(() => of({ record: null, notFound: true })),
        );
      }),
    ),
    { initialValue: { record: null as any, notFound: false } },
  );

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string | null {
    if (this.permissions() == null) {
      return null;
    }
    if (!this.permissions().delete?.can) {
      return this.recordPermissionService.generateTooltipMessage(this.permissions().delete?.reasons, 'delete');
    }
  }

  updatePermissions() {
    if (this.line() == null || !this.allowActions()) {
      return of(null);
    }
    return this.recordPermissionService.getPermission('acq_receipt_lines', this.line().pid).pipe(
      map((permissions) => {
        this.appStore.validateLibraryPermissions(permissions, this.receipt()?.library?.pid ?? '');
        return permissions;
      }),
    );
  }

  /** Delete a receipt line */
  delete(): void {
    this.acqReceiptApiService.deleteReceiptLine(this.line());
  }
}
