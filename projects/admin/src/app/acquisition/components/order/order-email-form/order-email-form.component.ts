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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { IAcqOrder } from '@app/admin/acquisition/classes/order';
import { Notification } from '@app/admin/classes/notification';
import { IPreview, ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-order-email-form',
  templateUrl: './order-email-form.component.html'
})
export class OrderEmailFormComponent implements OnInit, OnDestroy {

  /** the related order */
  @Input() order: IAcqOrder;

  /** Closing event for the modal dialog */
  @Output() closeDialog = new EventEmitter<boolean>(false);

  /** Reload data event to enable detection of data loading */
  @Output() recordChange = new EventEmitter<any>();

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

  /**
   * Constructor
   * @param acqOrderApiService - AcqOrderApiService
   * @param toastrService - ToastrService
   * @param translateService - TranslateService
   */
  constructor(
    private acqOrderApiService: AcqOrderApiService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { }

  /** onInit hook */
  ngOnInit(): void {
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
      .subscribe(
        (notification: Notification) => {
          if (notification.notification_sent) {
            this.toastrService.success(
              this.translateService.instant('order has been sent'),
              this.translateService.instant('Order sent')
            );
          } else {
            this.toastrService.warning(
              this.translateService.instant('order not yet send'),
              this.translateService.instant('Order delayed'),
              { disableTimeOut: true, closeButton: true }
            );
          }
          this.closeEmailDialog();
          this.acqOrderApiService
            .getOrder(this.order.pid)
            .subscribe((order: IAcqOrder) => this.recordChange.next(order));
        },
        (error: any) => {
          this.toastrService.error(
            error.error.message,
            this.translateService.instant('Error when placing an order !'),
            { disableTimeOut: true, closeButton: true }
          );
       });
  }

  /**
   * Close email dialog
   * Send the event to trigger the closing of the dialog
   * from the child to the parent
   */
  closeEmailDialog(): void {
    this.closeDialog.emit(true);
  }
}
