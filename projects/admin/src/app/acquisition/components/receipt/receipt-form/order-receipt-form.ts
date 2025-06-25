/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { inject, Injectable } from '@angular/core';
import { _ } from "@ngx-translate/core";
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApiService, extractIdOnRef } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { IAcqAccount } from '../../../classes/account';
import { AcqOrderLineStatus, IAcqOrder, IAcqOrderLine } from '../../../classes/order';
import { IAcqReceipt } from '../../../classes/receipt';
import { orderAccountsAsTree } from '../../../utils/account';
import { IAcqReceiptModel, OrderReceipt } from './order-receipt';

/** Select/Deselect all checkbox */
function lineAction(action: string, fields: any): void {
  fields.map((field: any) => {
    const selected = field.fieldGroup.find(line => line.key === 'selected');
    selected.formControl.setValue(action === 'select');
  });
}

@Injectable({
  providedIn: 'root'
})
export class OrderReceiptForm {

  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private apiService: ApiService = inject(ApiService);
  private orderReceipt: OrderReceipt = inject(OrderReceipt);

  /** Order Record */
  private orderRecord: any;

  /** Model */
  private model: IAcqReceiptModel;

  /** Form fields config */
  private config: any;

  /**
   * Set model
   * @param model - IReceiptModel
   * @returns OrderReceiptForm
   */
  setModel(model: IAcqReceiptModel): OrderReceiptForm {
    this.model = model;
    return this;
  }

  /**
   * Get model
   * @returns IReceiptModel
   */
  getModel(): IAcqReceiptModel {
    return this.model;
  }

  /**
   * Get order record
   * @returns Object order record
   */
  getOrderRecord() {
    return this.orderRecord;
  }

  /**
   * Get the formly configuration to build the form
   * @return: the formly fields configuration
   */
  getConfig(): FormlyFieldConfig[] {
    return this.config;
  }

  /**
   * Create form
   * @param orderPid - order pid
   * @returns Observable
   */
  createForm(orderPid: string): Observable<boolean> {
    this.config = this._getConfig();
    return this.acqOrderApiService
      .getOrder(orderPid)
      .pipe(
        tap((order: IAcqOrder) => this.orderRecord = order),
        switchMap((order: IAcqOrder) => {
          const libraryRef = order.library.$ref;
          const libraryPid = extractIdOnRef(libraryRef);
          this.acqAccountApiService
            .getAccounts(libraryPid)
            .subscribe((accounts: IAcqAccount[]) => {
              const to = this.config
                .filter((field: any) => field.key === 'amountAdjustments')[0].fieldArray.fieldGroup
                .filter((field: any) => field.key === 'acqAccount')[0].props;
                to.currency = order.currency;
                to.options = orderAccountsAsTree(accounts);
            });
          // Build the model
          this.model.acqOrderRef = this.apiService.getRefEndpoint('acq_orders', order.pid);
          this.model.libraryRef = libraryRef;
          this.model.organisationRef = order.organisation.$ref;
          order.vendor.pid = extractIdOnRef(order.vendor.$ref);
          const query = `AND (NOT status:"${AcqOrderLineStatus.CANCELLED}" OR NOT status:"${AcqOrderLineStatus.RECEIVED}")`;
          return this.acqOrderApiService.getOrderLines(order.pid, query).pipe(
            map((lines: IAcqOrderLine[]) => {
              lines.forEach((line: any) => {
                const quantityReceived = line.received_quantity || 0;
                this.model.receiptLines.push({
                  acqOrderLineRef: this.apiService.getRefEndpoint('acq_order_lines', line.pid),
                  selected: false,
                  quantity: line.quantity - quantityReceived,
                  quantityMax: line.quantity - quantityReceived,
                  amount: line.amount,
                  vatRate: 0
                });
              });
              return true;
          }));
        })
    );
  }

  /**
   * Process the form to build the corresponding AcqReceipt
   * @param model: The model containing the form data
   * @param record: The existing receipt (if exists)
   * @returns IAcqReceipt: the data to send to API to create a receipt
   */
  processForm(model: IAcqReceiptModel, record: IAcqReceipt): IAcqReceipt {
    // create the default record
    record = (!record)
      ? this.orderReceipt.processBaseRecord(model)
      : record;
    if (!record.hasOwnProperty('amount_adjustments')) {
      record.amount_adjustments = [];
    } else {
      // we received the resolved `acq_account` with pid, but we need the `$ref` field to send the form.
      record.amount_adjustments.map(
        (adjustment: any) => adjustment.acq_account = {$ref: this.apiService.getRefEndpoint('acq_accounts', adjustment.acq_account.pid)}
      );
    }
    if (!record.hasOwnProperty('notes')) {
      record.notes = [];
    }
    // Update the record with model data
    record.amount_adjustments = [...this.orderReceipt.processAdjustments(model) || []];
    record.notes = [...model.notes || []];
    if (model.reference && model.reference.length > 0) {
      record.reference = model.reference;
    }
    return this.orderReceipt.cleanData(record);
  }

  /**
   * Get the formly fields configuration used to build the AcqReceipt form
   * @returns: array of formly fields configuration
   */
  private _getConfig(): FormlyFieldConfig[] {
    return [
      {
        key: 'reference',
        type: 'string',
        props: {
          label: _('Reference'),
        },
      },
      {
        key: 'receiptDate',
        type: 'datePicker',
        props: {
          type: 'date',
          label: _('Reception date'),
          required: true
        },
        expressions: {
          "props.disabled": "model?.receiptLines?.length < 1"
        },
      },
      {
        key: 'amountAdjustments',
        type: 'array',
        props: {
          label: _('Fees, discounts and other adjustments')
        },
        fieldArray: {
          fieldGroupClassName: 'ui:grid ui:px-4 ui:mb-3',
          type: 'object',
          props: {
            label: _('Fee, discount and other adjustment'),
            containerCssClass: 'ui:grid ui:grid-cols-12 ui:gap-2',
          },
          fieldGroup: [
            {
              key: 'label',
              type: 'input',
              props: {
                label: _('Label'),
                required: true,
                minLength: 3,
                itemCssClass: "ui:col-span-12 ui:md:col-span-6"
              }
            },
            {
              key: 'amount',
              type: 'input',
              defaultValue: 1,
              props: {
                label: _('Amount'),
                type: 'number',
                description: _('To specify a discount, enter a negative amount'),
                required: true,
                itemCssClass: "ui:col-span-12 ui:md:col-span-3"
              }
            },
            {
              key: 'acqAccount',
              type: 'account-select',
              wrappers: ['form-field'],
              props: {
                placeholder: _('Select…'),
                label: _('Account'),
                required: true,
                itemCssClass: "ui:col-span-12 ui:md:col-span-9",
                options: [
                ]
              }
            }
          ]
        }
      },
      {
        key: 'notes',
        type: 'array',
        props: {
          containerCssClass: 'ui:grid ui:gap-2',
          label: _('Notes'),
          maxItems: 1
        },
        fieldArray: {
          type: "object",
          props: {
            label: _('Note')
          },
          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              defaultValue: 'staff_note',
              props: {
                label: _('Type'),
                alwaysHidden: true,
                options: [
                  { label: _('staff_note'), value: 'staff_note' }
                ]
              }
            },
            {
              key: 'content',
              type: 'textarea',
              props: {
                label: _('Note'),
                required: true,
                rows: 5
              }
            }
          ]
        }
      },
      {
        key: 'receiptLines',
        type: 'receipt-lines',
        expressions: {
          "props.disabled": "model.length < 1"
        },
        props: {
          selectUnselect: lineAction,
          minLength: 0
        },
        fieldArray: {
          fieldGroupClassName: 'ui:grid ui:grid-cols-12 ui:gap-4',
          validators: {
            validation: [
              { name: 'receiveQuantityMax', options: { errorPath: 'quantity' } }
            ]
          },
          fieldGroup: [
            {
              key: 'selected',
              type: 'checkbox',
              className: 'ui:col-span-1',
              wrappers: ['input-no-label'],
              props: {
                hideLabel: true,
                checkbox: true,
                headerClassName: 'ui:col-span-1',
              }
            },
            {
              key: 'acqOrderLineRef',
              type: 'order-line',
              wrappers: ['input-no-label'],
              className: 'ui:col-span-5',
              props: {
                headerClassName: 'ui:col-span-5 ui:font-bold',
                label: _('Order Line')
              }
            },
            {
              key: 'quantityMax',
              type: 'input',
              className: 'ui:hidden',
              props: {
                className: 'ui:hidden'
              }
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'ui:col-span-2',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'ui:col-span-2 ui:font-bold',
                styleClass: "ui:w-full",
                type: 'number',
                label: _('Qty'),
                required: true,
                min: 1,
                inputStep: 1
              }
            },
            {
              key: 'amount',
              type: 'input',
              className: 'ui:col-span-2',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'ui:col-span-2 ui:font-bold',
                type: 'number',
                label: _('Amount'),
                required: true,
                min: 0
              }
            },
            {
              key: 'vatRate',
              type: 'input',
              className: 'ui:col-span-2',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'ui:col-span-2 ui:font-bold',
                type: 'number',
                label: _('Vat Rate'),
                min: 0,
                max: 100,
                addonRight: [
                  '%'
                ]
              }
            }
          ]
        }
      },
    ];
  }
}
