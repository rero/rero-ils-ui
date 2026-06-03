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
import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ApiService, CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { finalize, tap } from 'rxjs/operators';
import { AcqReceiptApiService } from '../../../api/acq-receipt-api.service';
import { AcqReceiptAmountAdjustment, IAcqReceipt } from '../../../classes/receipt';
import { IAcqReceiptModel, ICreateLineMessage, OrderReceipt } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-order-receipt-view',
    templateUrl: './order-receipt-view.component.html',
    imports: [FormsModule, ReactiveFormsModule, TranslateDirective, Bind, Button, FormlyModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderReceiptViewComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private orderReceipt: OrderReceipt = inject(OrderReceipt);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private translateService: TranslateService = inject(TranslateService);
  private orderReceiptForm: OrderReceiptForm = inject(OrderReceiptForm);
  private messageService = inject(MessageService);
  private apiService:ApiService = inject(ApiService);

  private readonly _paramMap = toSignal(this.route.paramMap);
  private readonly _queryParamMap = toSignal(this.route.queryParamMap);

  // COMPONENTS ATTRIBUTES ====================================================
  /** order pid derived from route params */
  readonly orderPid = computed(() => this._paramMap()?.get('pid'));
  /** receipt pid derived from query params (present when editing an existing receipt) */
  private readonly receiptPid = computed(() => this._queryParamMap()?.get('receipt'));
  /** order Record */
  orderRecord: any;
  /** Receipt Record */
  private readonly receiptRecord = signal<any>(null);
  /** is save button has clicked */
  readonly orderSend = signal(false);
  /** All elements loaded */
  readonly loaded = signal(false);
  /** Formly configuration */
  form = new UntypedFormGroup({});
  /** Model */
  model: IAcqReceiptModel;

  /** Is the reception already known data should be displayed or not ? */
  knownDataCollapsed = true;

  /** Form fields */
  readonly fields = signal<FormlyFieldConfig[]>([]);

  /** OnInit hook */
  ngOnInit(): void {
    this._generateForm();
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * On Submit
   * @param model - ReceiptModel
   */
  onSubmit(model: IAcqReceiptModel): void {
    this.orderSend.set(true);
    let record: IAcqReceipt = (!this.receiptRecord())
      ? this.orderReceipt.processBaseRecord(model)
      : this.orderReceipt.processExistingRecord(this.receiptRecord());
    record = this.orderReceiptForm.processForm(model, record);

    const receiptApi$ = (!this.receiptRecord())
      ? this.acqReceiptApiService.createReceipt(record).pipe(tap(receipt => model.pid = receipt.pid))
      : this.acqReceiptApiService.updateReceipt(record.pid, record);
    receiptApi$
      .pipe(finalize(() => this.orderSend.set(false)))
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
    const receiptPid = this.receiptPid();
    if (receiptPid) {
      this.model.pid = receiptPid;
      this.acqReceiptApiService
        .getReceipt(receiptPid)
        .subscribe((receipt: IAcqReceipt) => {
          this.receiptRecord.set(receipt);
          this.model.reference = receipt.reference;
          this.model.notes = receipt.notes;
          if (receipt.amount_adjustments) {
            this.model.amountAdjustments =
              receipt.amount_adjustments.map((adj: AcqReceiptAmountAdjustment) => ({
                label: adj.label,
                amount: adj.amount,
                acqAccount: this.apiService.getRefEndpoint('acq_accounts', adj.acq_account.pid!)
              }));
          }
        });
    }
    this.orderReceiptForm
      .setModel(this.model)
      .createForm(this.orderPid()!)
      .subscribe((loaded: boolean) => {
        this.orderRecord = this.orderReceiptForm.getOrderRecord();
        this.model = this.orderReceiptForm.getModel();
        this.fields.set(this.orderReceiptForm.getConfig());
        this.loaded.set(loaded);
      });
  }

  /**
   * When the parent receipt is created, then we need to create the reception lines.
   * @param model: the model to process
   * @param receipt: the parent receipt object
   */
  private createLinesAndMessage(model: IAcqReceiptModel, _receipt: IAcqReceipt): void {
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
              detail: this.translateService.instant('Receipt operations were successful'),
              life: CONFIG.MESSAGE_LIFE
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
        detail: this.translateService.instant('Receipt operations were successful'),
        life: CONFIG.MESSAGE_LIFE
      });
      this.redirectToOrder();
    }
  }

  /** Redirect to order detail view */
  redirectToOrder(): void {
    this.router.navigate(['/acquisition', 'records', 'acq_orders', 'detail', this.orderPid()], { queryParams: {tab: 'reception'}});
  }
}
