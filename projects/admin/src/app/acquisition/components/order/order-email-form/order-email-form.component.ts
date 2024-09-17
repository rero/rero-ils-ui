/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
 * Copyright (C) 2023 UCLouvain
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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { IAcqOrder } from '@app/admin/acquisition/classes/order';
import { Notification } from '@app/admin/classes/notification';
import { IPreview, ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-order-email-form',
  templateUrl: './order-email-form.component.html'
})
export class OrderEmailFormComponent implements OnInit, OnDestroy {

  private messageService = inject(MessageService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private acqOrderApiService = inject(AcqOrderApiService);
  private translateService = inject(TranslateService);

  /** the related order */
  @Input() order: IAcqOrder;

  /** Available recipient types */
  emailTypes = ['to', 'cc', 'bcc', 'reply_to'];

  /** Mandatory email types */
  mandatoryEmailTypes = ['to', 'reply_to'];

  /** Suggested emails and PrePopulate recipients */
  suggestions: { emails: string[], recipients: ITypeEmail[] } = { emails: [], recipients: []};

  /** preview message data */
  response?: IPreview;

  /** all component subscription */
  private subscriptions = new Subscription();

  /** onInit hook */
  ngOnInit(): void {
    this.order = this.dynamicDialogConfig.data.order;
    this.subscriptions.add(this.acqOrderApiService
      .getOrderPreview(this.order.pid)
      .subscribe((response: IPreview) => {
        this.suggestions = Tools.processRecipientSuggestions(response.recipient_suggestions);
        this.response = response;
      })
    );
  }

  /** onDestroy hook */
  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  /**
   * Sending the order
   * @param recipients Array of email addresses
   */
  confirmOrder(recipients: ITypeEmail[]): void {
    this.acqOrderApiService
      .sendOrder(this.order.pid, recipients)
      .subscribe({
        next: (notification: Notification) => {
          if (notification.notification_sent) {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Order sent'),
              detail: this.translateService.instant('order has been sent')
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('Order delayed'),
              detail:  this.translateService.instant('order not yet send'),
              sticky: true,
              closable: true
            });
          }
          this.acqOrderApiService
            .getOrder(this.order.pid)
            .subscribe((order: IAcqOrder) => this.closeDialog(order));
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error when placing an order !'),
            detail: error.error.message,
            sticky: true,
            closable: true
          });
      }
    });
  }

  /**  Close email dialog */
  closeDialog(data?: IAcqOrder): void {
    this.dynamicDialogRef.close(data);
  }
}
