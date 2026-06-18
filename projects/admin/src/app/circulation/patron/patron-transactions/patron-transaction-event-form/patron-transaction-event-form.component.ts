// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UntypedFormGroup, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppStore, Tools } from '@rero/shared';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Button } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { DateTranslatePipe, HttpPendingService } from '@rero/ng-core';


@Component({
    selector: 'admin-patron-transaction-form',
    templateUrl: './patron-transaction-event-form.component.html',
    imports: [FormsModule, ReactiveFormsModule, FormlyModule, Bind, ScrollPanel, TranslateDirective, Button, CurrencyPipe, DateTranslatePipe, TranslatePipe, Panel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionEventFormComponent implements OnInit {

  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  readonly httpPending = inject(HttpPendingService);

  /** the transactions to perform with this form */
  transactions: PatronTransaction[];

  /** the action to do ; used as the form title : pay/dispute/resolve/... */
  action: string;

  /** if action is 'pay', the payment mode : full/part */
  private mode: string;

  /** form group */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** fields config of the form */
  formFields: FormlyFieldConfig[] = [];

  /** model of the form */
  model: FormModel;

  ngOnInit() {
    const data: any = this.dynamicDialogConfig.data;
    this.transactions = data.transactions;
    this.action = data.action;
    this.mode = data.mode;
    this._initForm();
  }

  /**
   * Init the form
   */
  private _initForm() {
    if (this.action === 'pay') {
      this.formFields.push(this._amountFormFieldDefinition());
      this.formFields.push(this._methodFormFieldDefinition());
      this.model = {
        amount: (this.mode === 'full') ? this._computeTotalAmount() : 0,
        method: 'cash'
      };
    } else if (this.action === 'cancel') {
      const placeholder = this.translateService.instant('Cancellation reason');
      this.formFields.push(this._amountFormFieldDefinition());
      this.formFields.push(this._commentFormFieldDefinition(placeholder));
      this.model = {
        amount: 0,
        method: 'cash'
      };
    } else {
      const placeholder = this.translateService.instant('Reason of dispute');
      this.formFields.push(this._commentFormFieldDefinition(placeholder));
    }
  }

  /** amount form field definition */
  private _amountFormFieldDefinition() {
    return {
      key: 'amount',
      type: 'input',
      focus: true,
      props: {
        label: this.translateService.instant('Amount'),
        type: 'number',
        min: 0,
        max: this._computeTotalAmount(),
        step: 0.1,
        pattern: '^\\d*(\\.\\d{0,2})?$',
        required: true,
        addonLeft: [
          Tools.currencySymbol(
            this.translateService.getCurrentLang(),
            this.appStore.organisation().default_currency
          )
        ]
      },
      validation: {
        messages: {
          pattern: (_error: ValidationErrors, _field: FormlyFieldConfig) => `Only 2 decimals are allowed`
        }
      },
      validators: {
        min: {
          // As we use 'step' property, we need to specify 'min' property to '0' for a nice value interval. But
          // with this special validator, we disallow to place a payment with a 0 amount
          expression: (c) => c.value > 0,
          message: (_error) => this.translateService.instant('Must be greater than 0')
        }
      }
    };
  }

  /** payment method form field definition */
  private _methodFormFieldDefinition() {
    return {
      key: 'method',
      type: 'select',
      props: {
        label: this.translateService.instant('Payment method'),
        required: true,
        placeholder: this.translateService.instant('Select…'),
        options: [
          {value: 'cash', label: this.translateService.instant('Cash')},
          {value: 'invoice', label: this.translateService.instant('Invoice')},
          {value: 'debit_card', label: this.translateService.instant('Debit card')},
          {value: 'credit_card', label: this.translateService.instant('Credit card')},
          {value: 'paypal', label: 'Paypal'}
        ]
      }
    };
  }

  /** comment form field definition */
  private _commentFormFieldDefinition(placeholder: string) {
    return {
      key: 'comment',
      type: 'textarea',
      props: {
        label: this.translateService.instant('Comment'),
        required: true,
        placeholder,
        rows: 4,
        minLength: 5
      }
    };
  }

  /**
   * Compute the total amount of the current event
   * @return totalAmount as number with maximum 2 decimals.
   */
  private _computeTotalAmount() {
    return this.transactions.reduce((acc, t) => parseFloat((acc + t.total_amount).toFixed(2)), 0);
  }

  /**
   * Allow to close the modal dialog box
   */
  closeModal() {
    this.dynamicDialogRef.close();
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.appStore.organisation();
  }

  /**
   * Submit the form and create a new PatronTransactionEvent
   */
  onSubmitForm() {
    if (this.httpPending.isPending()) { return; }
    const formValues = this.form.value;
    const observables: Observable<void>[] = [];
    if (this.action === 'pay') {
      let residualAmount = formValues.amount as number;
      for (const transaction of this.transactions) {
        const transactionAmount = (residualAmount >= transaction.total_amount)
          ? transaction.total_amount
          : residualAmount;
        observables.push(this.patronTransactionService.payPatronTransaction(transaction, transactionAmount, formValues.method));
        // DEV NOTES : We use the below syntax to avoid floating-number precision drift.
        //   on each iteration we 'round' the residual amount to a float with 2 decimals precision.
        //   --> with this syntax : (7.8 - 2 - 2 - 2) = 1.8
        //   --> without this syntax : (7.8 - 2 - 2 - 2) = 1.7999999999999998
        residualAmount = parseFloat((residualAmount - transactionAmount).toFixed(2));
        if (residualAmount <= 0) {
          break;
        }
      }
    } else if (this.action === 'dispute') {
      for (const transaction of this.transactions) {
        observables.push(this.patronTransactionService.disputePatronTransaction(transaction, formValues.comment));
      }
    } else if (this.action === 'cancel') {
      for (const transaction of this.transactions) {
        observables.push(this.patronTransactionService.cancelPatronTransaction(transaction, formValues.amount, formValues.comment));
      }
    }
    const patronPid = this.transactions[0]?.patron?.pid;
    forkJoin(observables).subscribe({
      next: () => this.dynamicDialogRef.close(patronPid)
    });
  }
}

/**
 * Interface to define fields on form
 */
type FormModel = {
  amount?: number;
  method?: string;
  comment?: string;
}
