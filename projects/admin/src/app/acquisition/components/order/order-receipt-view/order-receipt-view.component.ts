/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IReceiptOrder, LineStatus } from '../../../classes/receipt';
import { ICreateLineMessage, IReceiptLine, IReceiptModel, OrderReceipt } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';

@Component({
  selector: 'admin-order-receipt-view',
  templateUrl: './order-receipt-view.component.html'
})
export class OrderReceiptViewComponent implements OnInit {

  /** order pid */
  orderPid: string;

  /** order Record */
  orderRecord: any;

  /** Receipt Record */
  receiptRecord: any;

  /** Receipt Collapsed flag */
  receiptCollapsed = true;

  /** order send check for button */
  orderSend = false;

  /** All elements loaded */
  loaded = false;

  /** Formly configuration */
  form = new FormGroup({});

  /** Model */
  model: IReceiptModel;

  /** Form fields */
  fields: FormlyFieldConfig[];

  /**
   * Get receipt adjustments total
   * @returns number
   */
  get receiptAdjustmentsTotal() {
    let total = 0;
    if (this.receiptRecord) {
      this.receiptRecord.amount_adjustments.forEach((adj: any) => {
        total += adj.amount;
      });
    }
    return total;
  }

  /**
   * Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _orderReceipt - OrderReceipt
   * @param _acqReceiptApiService - AcqReceiptApiService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _orderReceiptForm - OrderReceiptForm
   */
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _orderReceipt: OrderReceipt,
    private _acqReceiptApiService: AcqReceiptApiService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _orderReceiptForm: OrderReceiptForm
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this.orderPid = this._route.snapshot.paramMap.get('pid');
    this._generateForm(
      this.orderPid,
      this._route.snapshot.queryParams.receipt
    );
  }

  /**
   * On Submit
   * @param model - ReceiptModel
   */
  onSubmit(model: IReceiptModel): void {
    this.orderSend = true;
    let record: IReceiptOrder = (!this.receiptRecord)
      ? this._orderReceipt.processBaseRecord(model)
      : this.receiptRecord;
    record = this._orderReceiptForm.processForm(model, record);
    if (!this.receiptRecord) {
      // Create a receipt record
      this._acqReceiptApiService.createReceipt(record).subscribe((result: IReceiptOrder) => {
        // Assign acquisition receipt pid
        model.pid = result.pid;
        this._createLinesAndMessage(
          this._translateService.instant('The receipt was successful'),
          this._translateService.instant('The receipt was not successful'),
          model,
          result
        );
      });
    } else {
      // Update receipt record
      this._acqReceiptApiService.updateReceipt(model.pid, record).subscribe((result: IReceiptOrder) => {
        this._createLinesAndMessage(
          this._translateService.instant('The update of receipt was successful'),
          this._translateService.instant('The update receipt was not successful'),
          model,
          result
        );
      });
    }
  }

  /**
   * Generate Form
   * @param orderPid - order pid
   * @param receiptPid - receipt order pid
   */
  private _generateForm(orderPid: string, receiptPid: string): void {
    this.model = this._orderReceipt.model;
    if (receiptPid) {
      this.model.pid = receiptPid;
      this._acqReceiptApiService.getReceipt(receiptPid).subscribe((record: IReceiptOrder) => {
        this.receiptRecord = record;
      });
    }
    this._orderReceiptForm.setModel(this.model).createForm(orderPid)
      .subscribe((loaded: boolean) => {
        this.orderRecord = this._orderReceiptForm.getOrderRecord();
        this.model = this._orderReceiptForm.getModel();
        this.fields = this._orderReceiptForm.getConfig();
        this.loaded = loaded;
      });
  }

  /**
   * Create lines and show toastr message
   * @param messageSuccess - message for success
   * @param messagWarning - message for warning
   * @param model - IReceiptModel
   * @param receiptOrder - IReceiptOrder
   */
  private _createLinesAndMessage(messageSuccess: string, messagWarning: string, model: IReceiptModel, receiptOrder: IReceiptOrder): void {
    if (receiptOrder) {
      const lines = this._orderReceipt.processlines(model);
      this._acqReceiptApiService.createReceiptLines(model.pid, lines).pipe(
        map((response: IReceiptLine[] | null) => {
          const linesMessage = this._translateService.instant('The adding of receipt lines was not successful');
          const output: ICreateLineMessage = { success: response !== null, messages: [] };
          if (response === null) {
            output.messages.push(linesMessage);
          }
          if (response !== null && (response.some((line) => line.status === LineStatus.FAILURE))) {
            output.success = false;
            const errorMessages = response
              .filter((line: IReceiptLine) => line.status === LineStatus.FAILURE)
              .map((line: IReceiptLine) => line.error_message);
            output.messages.push(linesMessage);
            errorMessages.forEach((message: string) => output.messages.push(this._translateService.instant(message)));
          }
          return output;
        })).subscribe((result: ICreateLineMessage) => {
          if (result.success) {
            this._toastrService.success(
              this._translateService.instant(messageSuccess),
              this._translateService.instant('Receipt')
            );
          } else {
            this._toastrService.error(
              this._translateService.instant(result.messages.join('\n')),
              this._translateService.instant('Receipt'),
              { disableTimeOut: true, closeButton: true }
            );
          }
          this._redirectToOrder();
        });
    } else {
      this._toastrService.warning(
        this._translateService.instant(messagWarning),
        this._translateService.instant('Receipt'),
        { disableTimeOut: true, closeButton: true }
      );
      this._redirectToOrder();
    }
  }

  /** Redirect to order detail view */
  private _redirectToOrder(): void {
    this._router.navigate(['/', 'records', 'acq_orders', 'detail', this.orderPid]);
  }
}
