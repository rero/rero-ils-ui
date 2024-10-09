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
import { inject, Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
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
function lineAction($event: Event, action: string, fields: any): void {
  $event.preventDefault();
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
                this.model.receiveLines.push({
                  acqOrderLineRef: this.apiService.getRefEndpoint('acq_order_lines', line.pid),
                  selected: false,
                  document: line.document.pid,
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
    record.amount_adjustments = [...record.amount_adjustments, ...this.orderReceipt.processAdjustments(model)];
    record.notes = [...record.notes, ...model.notes || []];
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
        type: 'datepicker',
        props: {
          type: 'date',
          label: _('Reception date'),
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
        props: {
          className: 'pl-0 my-0 font-weight-bold',
          label: _('Order line(s)'),
          addButton: false,
          trashButton: false,
          selectUnselect: lineAction,
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
              key: 'selected',
              type: 'checkbox',
              className: 'col-1',
              wrappers: ['input-no-label'],
              props: {
                hideLabel: true,
                headerClassName: 'col-1 font-weight-bold mb-2',
              }
            },
            {
              key: 'document',
              type: 'field-document-brief-view',
              className: 'col-5',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'col-5 font-weight-bold mb-2',
                label: _('Document'),
                resource: 'documents',
                resourceKey: 'document',
                resourceField: 'title.0._text',
                resourceSelect: {
                  field: 'type',
                  value: 'bf:Title'
                }
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
              props: {
                headerClassName: 'col-2 font-weight-bold mb-2',
                type: 'number',
                label: _('Qty'),
                required: true,
                min: 1
              }
            },
            {
              key: 'amount',
              type: 'input',
              className: 'col-2',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'col-2 font-weight-bold mb-2',
                type: 'number',
                label: _('Amount'),
                required: true,
                min: 0
              }
            },
            {
              key: 'vatRate',
              type: 'input',
              className: 'col-2',
              wrappers: ['input-no-label'],
              props: {
                headerClassName: 'col-2 font-weight-bold mb-2',
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
      {
        key: 'amountAdjustments',
        type: 'repeat',
        props: {
          className: 'pl-0 my-0 font-weight-bold',
          label: _('Fees, discounts and other adjustments'),
          addButton: true,
          trashButton: true
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'label',
              type: 'input',
              props: {
                label: _('Label'),
                required: true,
                minLength: 3
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
                required: true
              }
            },
            {
              key: 'acqAccount',
              type: 'select-account',
              wrappers: ['form-field'],
              props: {
                placeholder: _('Select an account'),
                label: _('Account'),
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
        props: {
          className: 'pl-0 my-0 font-weight-bold',
          label: _('Notes'),
          addButton: true,
          trashButton: true
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              defaultValue: 'staff_note',
              props: {
                label: _('Type'),
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
      }
    ];
  }
}
