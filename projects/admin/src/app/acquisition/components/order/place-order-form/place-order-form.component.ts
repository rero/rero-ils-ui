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
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AcqAddressRecipient, AcqOrder, AcqOrderPreview } from 'projects/admin/src/app/acquisition/classes/order';
import { Notification } from 'projects/admin/src/app/classes/notification';
import { AcqOrderService } from '../../../services/acq-order.service';

@Component({
  selector: 'admin-place-order-form',
  templateUrl: './place-order-form.component.html',
  styleUrls: ['./place-order-form.component.scss']
})
export class PlaceOrderFormComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** the reference to the modal */
  modalRef?: BsModalRef;
  /** the related order */
  order: AcqOrder;
  /** subject to emit when the order as successfully sent */
  onOrderSentEvent = new EventEmitter<AcqOrder>();
  /** preview message data */
  preview?: AcqOrderPreview;
  /** is the selected sentTo value is custom ? */
  customRecipientEnabled = false;
  /** The order notification recipient address */
  recipientAddress?: string;
  /** is the confirm is pressed an order command has sent */
  confirmInProgress = false;



  get isRecipientValid(): boolean {
    return (this.recipientAddress)
      ? this._validateEmail(this.recipientAddress)
      : false;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _acqOrderService - AcqOrderService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _router - Router
   */
  constructor(
    private _modalService: BsModalService,
    protected _bsModalRef: BsModalRef,
    private _acqOrderService: AcqOrderService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _router: Router
  ) {
    this.modalRef = _bsModalRef;
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._acqOrderService.getOrderPreview(this.order.pid).subscribe((preview: AcqOrderPreview) => this.preview = preview);
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Specify where the order should be sent.
   * @param type: the type of recipient (vendor, library or custom)
   * @param address: the email address where the order should be sent.
   */
  sentTo(type: string, address?: string) {
    if (address != null) {
      this.recipientAddress = address;
    }
    this.customRecipientEnabled = type === 'custom';
  }

  confirmOrder() {
    this.confirmInProgress = true;
    const emails: AcqAddressRecipient[] = [
      { type: 'to', address: this.recipientAddress },
      { type: 'reply_to', address: this.preview.data.library.shipping_informations.email },
    ];
    this._acqOrderService.sendOrder(this.order.pid, emails)
      .pipe(finalize(() => this.confirmInProgress = false))
      .subscribe(
        (notification: Notification) => {
          if (notification.notification_sent) {
            this._toastrService.success(
              this._translateService.instant('order sent to {address}', { address: this.recipientAddress }),
              this._translateService.instant('Order sent')
            );
          } else {
            this._toastrService.warning(
              this._translateService.instant('order not yet send'),
              this._translateService.instant('Order delayed'),
              { disableTimeOut: true, closeButton: true }
            );
          }
          this.modalRef.hide();
          this._acqOrderService
            .getOrder(this.order.pid)
            .subscribe((order: AcqOrder) => this.onOrderSentEvent.next(order));
        },
        (error: any) => {
          this._toastrService.error(
            error.error.message,
            this._translateService.instant('Error when placing an order !'),
            { disableTimeOut: true, closeButton: true }
          );
       });
  }

  // PRIVATE FUNCTIONS ========================================================

  private _validateEmail(email) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}
