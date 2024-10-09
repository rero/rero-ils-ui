/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { finalize, tap } from 'rxjs/operators';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { IAcqReceipt } from '../../../classes/receipt';
import { IAcqReceiptModel, ICreateLineMessage, OrderReceipt } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';

@Component({
  selector: 'admin-order-receipt-view',
  templateUrl: './order-receipt-view.component.html',
  styleUrls: ['../../../acquisition.scss']
})
export class OrderReceiptViewComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private orderReceipt: OrderReceipt = inject(OrderReceipt);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private translateService: TranslateService = inject(TranslateService);
  private orderReceiptForm: OrderReceiptForm = inject(OrderReceiptForm);
  private messageService = inject(MessageService);

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
  form = new UntypedFormGroup({});
  /** Model */
  model: IAcqReceiptModel;

  /** Is the reception already known data should be displayed or not ? */
  knownDataCollapsed = true;

  /** Form fields */
  private _fields: FormlyFieldConfig[];

  // GETTER & SETTER ==========================================================

  /** Get formly fields to use to render the form */
  get fields(): FormlyFieldConfig[] {
    // If the model contains a PID, we would set the `reference` field in readonly.
    // The reference field should be enabled only for `AcqReceipt` creation, not for update.
    // To update this field, user must use the classic resource editor.
    if (this.model.pid) {
      this._fields.find(field => field.key === 'reference').props.readonly = true;
    }
    return this._fields;
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.orderPid = this.route.snapshot.paramMap.get('pid');
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
      ? this.orderReceipt.processBaseRecord(model)
      : this.orderReceipt.processExistingRecord(this.receiptRecord);
    record = this.orderReceiptForm.processForm(model, record);

    const receiptApi$ = (!this.receiptRecord)
      ? this.acqReceiptApiService.createReceipt(record).pipe(tap(receipt => model.pid = receipt.pid))
      : this.acqReceiptApiService.updateReceipt(record.pid, record);
    receiptApi$
      .pipe(finalize(() => this.orderSend = false))
      .subscribe({
        next: (receipt: IAcqReceipt) => this.createLinesAndMessage(model, receipt),
        error: (err) => this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Receipt'),
          detail: err.title,
          sticky: true,
          closable: true
        })
      });
  }

  // COMPONENT PRIVATE FUNCTIONS ==============================================
  /**
   * Generate Form
   */
  private _generateForm(): void {
    this.model = this.orderReceipt.model;

    // Try to load the receipt depending of the url argument
    const receiptPid = this.route.snapshot.queryParams.receipt;
    if (receiptPid) {
      this.acqReceiptApiService
        .getReceipt(receiptPid)
        .subscribe((receipt: IAcqReceipt) => {
          this.receiptRecord = receipt;
          this.model.pid = receiptPid;
          this.model.reference = receipt.reference;
        });
    }
    this.orderReceiptForm
      .setModel(this.model)
      .createForm(this.orderPid)
      .subscribe((loaded: boolean) => {
        this.orderRecord = this.orderReceiptForm.getOrderRecord();
        this.model = this.orderReceiptForm.getModel();
        this._fields = this.orderReceiptForm.getConfig();
        this.loaded = loaded;
      });
  }

  /**
   * When the parent receipt is created, then we need to create the reception lines.
   * @param model: the model to process
   * @param receipt: the parent receipt object
   */
  private createLinesAndMessage(model: IAcqReceiptModel, receipt: IAcqReceipt): void {
    // receipt exists, we can create corresponding lines
    const lines = this.orderReceipt.processLines(model);
    if (lines.length > 0) {
      this.acqReceiptApiService
        .createReceiptLines(model.pid, lines)
        .subscribe((result: ICreateLineMessage) => {
          if (result.success) {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Receipt'),
              detail: this.translateService.instant('Receipt operations were successful')
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Receipt'),
              detail: this.translateService.instant(result.messages),
              sticky: true,
              closable: true
            });
          }
          this.redirectToOrder();
        });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('Receipt'),
        detail: this.translateService.instant('Receipt operations were successful')
      });
      this.redirectToOrder();
    }
  }

  /** Redirect to order detail view */
  private redirectToOrder(): void {
    this.router.navigate(['/', 'records', 'acq_orders', 'detail', this.orderPid]);
  }
}
