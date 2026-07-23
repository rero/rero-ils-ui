// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { IAcqOrder } from '@app/admin/acquisition/classes/order';
import { Notification } from '@app/admin/classes/notification';
import { PreviewEmailComponent, RecipientType } from '@app/admin/shared/preview-email/component/preview-email/preview-email.component';
import { IPreview, ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'admin-order-email-form',
    templateUrl: './order-email-form.component.html',
    imports: [PreviewEmailComponent, TranslateDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEmailFormComponent {

  private messageService = inject(MessageService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private acqOrderApiService = inject(AcqOrderApiService);
  private translateService = inject(TranslateService);

  readonly order: IAcqOrder = this.dynamicDialogConfig.data.order;

  readonly emailTypes: RecipientType[] = ['to', 'cc', 'bcc', 'reply_to'];
  readonly mandatoryEmailTypes: RecipientType[] = ['to', 'reply_to'];

  readonly response = toSignal<IPreview | undefined>(
    this.acqOrderApiService.getOrderPreview(this.order.pid!)
  );

  readonly suggestions = computed(() => {
    const preview = this.response();
    return preview
      ? Tools.processRecipientSuggestions(preview.recipient_suggestions)
      : { emails: [], recipients: [] };
  });

  confirmOrder(recipients: ITypeEmail[]): void {
    this.acqOrderApiService.sendOrder(this.order.pid!, recipients).pipe(
      tap((notification: Notification) => this.showOrderMessage(notification)),
      switchMap(() => this.acqOrderApiService.getOrder(this.order.pid!, 1))
    ).subscribe({
      next: (order: IAcqOrder) => this.closeDialog(order),
      error: (err: HttpErrorResponse) => this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Error when placing an order !'),
        detail: err.error.message,
        sticky: true,
        closable: true
      })
    });
  }

  closeDialog(data?: IAcqOrder): void {
    this.dynamicDialogRef.close(data);
  }

  private showOrderMessage(notification: Notification): void {
    this.messageService.add(notification.notification_sent
      ? { severity: 'success', summary: this.translateService.instant('Order sent'), detail: this.translateService.instant('order has been sent'), life: CONFIG.MESSAGE_LIFE }
      : { severity: 'warn', summary: this.translateService.instant('Order delayed'), detail: this.translateService.instant('order not yet send'), life: CONFIG.MESSAGE_LIFE }
    );
  }
}
