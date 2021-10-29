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
import { finalize, map, tap } from 'rxjs/operators';
import { AcqReceiptService } from '../../../services/acq-receipt.service';
import { AcqReceipt, IAcqReceipt } from '../../../classes/receipt';
import { ICreateLineMessage, IAcqReceiptModel, OrderReceipt, IResponseReceiptLine, AcqResponseReceiptLineStatus } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';

@Component({
  selector: 'admin-order-receipt-view',
  templateUrl: './order-receipt-view.component.html',
  styleUrls: ['../../../acquisition.scss']
})
export class OrderReceiptViewComponent implements OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** order pid */
  orderPid: string;
  /** order Record */
  orderRecord: any;
  /** Receipt Record */
  receiptRecord: any;
  /** is save button has clicked */
  orderSend = false;
  /** All elements loaded */
  loaded = false;
  /** Formly configuration */
  form = new FormGroup({});
  /** Model */
  model: IAcqReceiptModel;
  /** Form fields */
  fields: FormlyFieldConfig[];

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _orderReceipt - OrderReceipt
   * @param _acqReceiptService - AcqReceiptService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _orderReceiptForm - OrderReceiptForm
   */
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _orderReceipt: OrderReceipt,
    private _acqReceiptService: AcqReceiptService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _orderReceiptForm: OrderReceiptForm
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this.orderPid = this._route.snapshot.paramMap.get('pid');
    this._generateForm();
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * On Submit
   * @param model - ReceiptModel
   */
  onSubmit(model: IAcqReceiptModel): void {
    this.orderSend = true;
    let record: IAcqReceipt = (!this.receiptRecord)
      ? this._orderReceipt.processBaseRecord(model)
      : this._orderReceipt.processExistingRecord(this.receiptRecord);
    record = this._orderReceiptForm.processForm(model, record);

    const receiptApi$ = (!this.receiptRecord)
      ? this._acqReceiptService.createReceipt(record).pipe(tap(receipt => model.pid = receipt.pid))
      : this._acqReceiptService.updateReceipt(record);
    receiptApi$
      .pipe(finalize(() => this.orderSend = false))
      .subscribe(
        (receipt: AcqReceipt) => this._createLinesAndMessage(model, receipt),
        (err) => {
          console.error(err);
          this._toastrService.error(
            err.title, this._translateService.instant('Receipt'),
            { disableTimeOut: true, closeButton: true }
          );
        }
      );
  }

  // COMPONENT PRIVATE FUNCTIONS ==============================================
  /**
   * Generate Form
   */
  private _generateForm(): void {
    this.model = this._orderReceipt.model;

    // Try to load the receipt depending of the url argument
    const receiptPid = this._route.snapshot.queryParams.receipt;
    if (receiptPid) {
      this._acqReceiptService
        .getReceipt(receiptPid)
        .subscribe((receipt: AcqReceipt) => {
          this.receiptRecord = receipt;
          this.model.pid = receiptPid;
        });
    }
    this._orderReceiptForm
      .setModel(this.model)
      .createForm(this.orderPid)
      .subscribe((loaded: boolean) => {
        this.orderRecord = this._orderReceiptForm.getOrderRecord();
        this.model = this._orderReceiptForm.getModel();
        this.fields = this._orderReceiptForm.getConfig();
        this.loaded = loaded;
      });
  }

  /**
   * When the parent receipt is created, then we need to create the reception lines.
   * @param model: the model to process
   * @param receipt: the parent receipt object
   */
  private _createLinesAndMessage(model: IAcqReceiptModel, receipt: AcqReceipt): void {
    // receipt exists, we can create corresponding lines
    const lines = this._orderReceipt.processLines(model);
    if (lines.length > 0) {
      this._acqReceiptService
        .createReceiptLines(model.pid, lines)
        .subscribe((result: ICreateLineMessage) => {
          if (result.success) {
            this._toastrService.success(
              this._translateService.instant('Receipt operations were successful'),
              this._translateService.instant('Receipt')
            );
          } else {
            this._toastrService.error(
              this._translateService.instant(result.messages.join('\n')),
              this._translateService.instant('Receipt'),
              {disableTimeOut: true, closeButton: true}
            );
          }
          this._redirectToOrder();
        });
    } else {
      this._toastrService.success(
        this._translateService.instant('Receipt operations were successful'),
        this._translateService.instant('Receipt')
      );
      this._redirectToOrder();
    }
  }

  /** Redirect to order detail view */
  private _redirectToOrder(): void {
    this._router.navigate(['/', 'records', 'acq_orders', 'detail', this.orderPid]);
  }
}