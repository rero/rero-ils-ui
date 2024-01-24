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
import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';


@Component({
  selector: 'admin-patron-transaction-form',
  templateUrl: './patron-transaction-event-form.component.html'
})
export class PatronTransactionEventFormComponent implements OnInit {

  /** the transactions to perform with this form */
  transactions: Array<PatronTransaction>;

  /** the action to do ; used as the form title : pay/dispute/resolve/... */
  action: string;

  /** if action is 'pay', the payment mode : full/part */
  private _mode: string;

  /** form group */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** fields config of the form */
  formFields: FormlyFieldConfig[] = [];

  /** model of the form */
  model: FormModel;

  constructor(
    private _modalService: BsModalService,
    private _translateService: TranslateService,
    protected _organisationService: OrganisationService,
    protected _bsModalRef: BsModalRef,
    private _patronTransactionService: PatronTransactionService
  ) { }

  ngOnInit() {
    const initialState: any = this._modalService.config.initialState;
    this.transactions = initialState.transactions;
    this.action = initialState.action;
    this._mode = initialState.mode;
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
        amount: (this._mode === 'full') ? this._computeTotalAmount() : 0,
        method: 'cash'
      };
    } else if (this.action === 'cancel') {
      const placeholder = this._translateService.instant('Cancellation reason');
      this.formFields.push(this._amountFormFieldDefinition());
      this.formFields.push(this._commentFormFieldDefinition(placeholder));
      this.model = {
        amount: 0,
        method: 'cash'
      };
    } else {
      const placeholder = this._translateService.instant('Reason of dispute');
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
        label: this._translateService.instant('Amount'),
        type: 'number',
        min: 0,
        max: this._computeTotalAmount(),
        step: 0.1,
        pattern: '^\\d*(\\.\\d{0,2})?$',
        required: true,
        addonLeft: [
          getCurrencySymbol(this._organisationService.organisation.default_currency, 'wide')
        ]
      },
      validation: {
        messages: {
          pattern: (error, field: FormlyFieldConfig) => `Only 2 decimals are allowed`
        }
      },
      validators: {
        min: {
          // As we use 'step' property, we need to specify 'min' property to '0' for a nice value interval. But
          // with this special validator, we disallow to place a payment with a 0 amount
          expression: (c) => c.value > 0,
          message: (error) => this._translateService.instant('Must be greater than 0')
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
        label: this._translateService.instant('Payment method'),
        required: true,
        placeholder: this._translateService.instant('Select…'),
        options: [
          {value: 'cash', label: this._translateService.instant('Cash')},
          {value: 'invoice', label: this._translateService.instant('Invoice')},
          {value: 'debit_card', label: this._translateService.instant('Debit card')},
          {value: 'credit_card', label: this._translateService.instant('Credit card')},
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
        label: this._translateService.instant('Comment'),
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
    this._bsModalRef.hide();
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  /**
   * Submit the form and create a new PatronTransactionEvent
   */
  onSubmitForm() {
    const formValues = this.form.value;
    if (this.action === 'pay') {
      let residualAmount = formValues.amount as number;
      for (const transaction of this.transactions) {
        const transactionAmount = (residualAmount >= transaction.total_amount)
          ? transaction.total_amount
          : residualAmount;
        this._patronTransactionService.payPatronTransaction(transaction, transactionAmount, formValues.method);
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
        this._patronTransactionService.disputePatronTransaction(transaction, formValues.comment);
      }
    } else if (this.action === 'cancel') {
      for (const transaction of this.transactions) {
        this._patronTransactionService.cancelPatronTransaction(transaction, formValues.amount, formValues.comment);
      }
    }
    this._bsModalRef.hide();
  }
}

/**
 * Interface to define fields on form
 */
interface FormModel {
  amount?: number;
  method?: string;
  comment?: string;
}
