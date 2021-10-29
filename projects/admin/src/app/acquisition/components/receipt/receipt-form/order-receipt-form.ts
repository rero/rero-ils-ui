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
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApiService, extractIdOnRef } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AcqAccount } from '../../../classes/account';
import { AcqOrder, AcqOrderLine, AcqOrderLineStatus } from '../../../classes/order';
import { AcqReceipt, IAcqReceipt } from '../../../classes/receipt';
import { AcqAccountService } from '../../../services/acq-account.service';
import { AcqOrderService } from '../../../services/acq-order.service';
import { orderAccountsAsTree } from '../../../utils/account';
import { IAcqReceiptModel, OrderReceipt } from './order-receipt';

@Injectable({
  providedIn: 'root'
})
export class OrderReceiptForm {

  /** Order Record */
  private _orderRecord: any;

  /** Model */
  private _model: IAcqReceiptModel;

  /** Form fields config */
  private _config: FormlyFieldConfig[];

  /**
   * Constructor
   * @param _acqOrderService - AcqOrderService
   * @param _acqAccountService - AcqAccountService
   * @param _apiService - ApiService
   * @param _orderReceipt - OrderReceipt
   */
  constructor(
    private _acqOrderService: AcqOrderService,
    private _acqAccountService: AcqAccountService,
    private _apiService: ApiService,
    private _orderReceipt: OrderReceipt
  ) {}

  /**
   * Set model
   * @param model - IReceiptModel
   * @returns OrderReceiptForm
   */
  setModel(model: IAcqReceiptModel): OrderReceiptForm {
    this._model = model;
    return this;
  }

  /**
   * Get model
   * @returns IReceiptModel
   */
  getModel(): IAcqReceiptModel {
    return this._model;
  }

  /**
   * Get order record
   * @returns Object order record
   */
  getOrderRecord() {
    return this._orderRecord;
  }

  /**
   * Get the formly configuration to build the form
   * @return: the formly fields configuration
   */
  getConfig(): FormlyFieldConfig[] {
    return this._config;
  }

  /**
   * Create form
   * @param orderPid - order pid
   * @returns Observable
   */
  createForm(orderPid: string): Observable<boolean> {
    this._config = this._getConfig();
    return this._acqOrderService
      .getOrder(orderPid)
      .pipe(
        tap((order: AcqOrder) => this._orderRecord = order),
        switchMap((order: AcqOrder) => {
          const libraryRef = order.library.$ref;
          const libraryPid = extractIdOnRef(libraryRef);
          this._acqAccountService
            .getAccounts(libraryPid)
            .subscribe((accounts: AcqAccount[]) => {
              const to = this._config
                .filter((field) => field.key === 'amountAdjustments')[0].fieldArray.fieldGroup
                .filter((field) => field.key === 'acqAccount')[0].templateOptions;
              to.currency = order.currency;
              to.options = orderAccountsAsTree(accounts);
            });
          // Build the model
          this._model.acqOrderRef = this._apiService.getRefEndpoint('acq_orders', order.pid);
          this._model.libraryRef = libraryRef;
          this._model.organisationRef = order.organisation.$ref;
          order.vendor.pid = extractIdOnRef(order.vendor.$ref);
          const query = `AND (NOT status:"${AcqOrderLineStatus.CANCELLED}" OR NOT status:"${AcqOrderLineStatus.RECEIVED}")`;
          return this._acqOrderService.getOrderLines(order.pid, query).pipe(
            map((lines: AcqOrderLine[]) => {
              lines.forEach((line: any) => {
                const quantityReceived = line.received_quantity || 0;
                this._model.receiveLines.push({
                  acqOrderLineRef: this._apiService.getRefEndpoint('acq_order_lines', line.pid),
                  document: line.document.pid,
                  quantity: line.quantity - quantityReceived,
                  quantityMax: line.quantity - quantityReceived,
                  amount: line.amount
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
      ? this._orderReceipt.processBaseRecord(model)
      : record;
    if (!record.hasOwnProperty('amount_adjustments')) {
      record.amount_adjustments = [];
    }
    if (!record.hasOwnProperty('notes')) {
      record.notes = [];
    }
    // Update the record with model data
    record.amount_adjustments = [...record.amount_adjustments, ...this._orderReceipt.processAdjustments(model)];
    record.notes = [...record.notes, ...model.notes || []];
    return this._orderReceipt.cleanData(record);
  }

  /**
   * Get the formly fields configuration used to build the AcqReceipt form
   * @returns: array of formly fields configuration
   */
  private _getConfig(): FormlyFieldConfig[] {
    return [
      {
        key: 'receiptDate',
        type: 'datepicker',
        templateOptions: {
          type: 'date',
          label: 'Reception date',
          required: true
        }
      },
      {
        key: 'exchangeRate',
        type: 'input',
        defaultValue: 1,
        hideExpression: true
      },
      {
        key: 'receiveLines',
        type: 'repeat',
        templateOptions: {
          className: 'pl-0 my-0 font-weight-bold',
          label: 'Order line(s)',
          addButton: false,
          minLength: 0
        },
        fieldArray: {
          fieldGroupClassName: 'row',
          validators: {
            validation: [
              { name: 'receiveQuantityMax', options: { errorPath: 'quantity' } }
            ]
          },
          fieldGroup: [
            {
              key: 'acqOrderLineRef',
              type: 'input',
              hideExpression: true
            },
            {
              key: 'document',
              type: 'field-ref',
              className: 'col-8',
              wrappers: ['input-no-label'],
              templateOptions: {
                headerClassName: 'col-8 font-weight-bold mb-2',
                label: 'Document',
                resource: 'documents',
                recourceKey: 'document',
                resourceField: 'title.0._text'
              }
            },
            {
              key: 'quantityMax',
              type: 'input',
              wrappers: ['hide']
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-2',
              wrappers: ['input-no-label'],
              templateOptions: {
                headerClassName: 'col-2 font-weight-bold mb-2',
                type: 'number',
                label: 'Qty',
                required: true,
                min: 1
              }
            },
            {
              key: 'amount',
              type: 'input',
              className: 'col-2',
              wrappers: ['input-no-label'],
              templateOptions: {
                headerClassName: 'col-2 font-weight-bold mb-2',
                type: 'number',
                label: 'Amount',
                required: true,
                min: 0
              }
            }
          ]
        }
      },
      {
        key: 'amountAdjustments',
        type: 'repeat',
        templateOptions: {
          className: 'pl-0 my-0 font-weight-bold',
          label: 'Amount Adjustements',
          addButton: true
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'label',
              type: 'input',
              templateOptions: {
                label: 'Label',
                required: true,
                minLength: 3
              }
            },
            {
              key: 'amount',
              type: 'input',
              defaultValue: 1,
              templateOptions: {
                label: 'Amount',
                type: 'number',
                required: true
              }
            },
            {
              key: 'acqAccount',
              type: 'select-account',
              wrappers: ['form-field'],
              templateOptions: {
                placeholder: 'Select an account',
                label: 'Account',
                required: true,
                options: []
              }
            }
          ]
        }
      },
      {
        key: 'notes',
        type: 'repeat',
        templateOptions: {
          className: 'pl-0 my-0 font-weight-bold',
          label: 'Notes',
          addButton: true
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              defaultValue: 'staff_note',
              templateOptions: {
                label: 'Type',
                options: [
                  { label: 'staff_note', value: 'staff_note' }
                ]
              }
            },
            {
              key: 'content',
              type: 'textarea',
              templateOptions: {
                label: 'Note',
                required: true,
                rows: 5
              }
            }
          ]
        }
      }
    ];
  }
}
