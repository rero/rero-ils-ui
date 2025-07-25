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
import { ApiService } from '@rero/ng-core';
import { IAcqNote } from '../../../classes/common';
import { AcqReceiptAmountAdjustment, IAcqReceipt, IAcqReceiptLine } from '../../../classes/receipt';
import { DateTime } from 'luxon';

/** Interface for Receipt data */
export interface IAcqReceiptModel {
  pid?: string;
  acqOrderRef: string;
  libraryRef: string;
  organisationRef: string;
  receiptDate: string;
  reference: string;
  amountAdjustments: Array<{
    label: string;
    amount: number;
    acqAccount: string;
  }>;
  notes: IAcqNote[];
  receiptLines: {
    acqOrderLineRef: string,
    selected: boolean,
    document?: string,
    quantityMax: number,
    quantity: number,
    amount: number,
    vatRate: number
  }[];
}

export interface IResponseReceiptLine {
  data: object;
  status: string;
  line?: object;
  error_message?: string;
}

export interface IResponseReceiptLine {
  response: IResponseReceiptLine[];
}

export enum AcqResponseReceiptLineStatus {
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export interface ICreateLineMessage {
  success: boolean;
  messages?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderReceipt {

  private apiService: ApiService = inject(ApiService);

  /** Model */
  get model(): IAcqReceiptModel {
    return {
      pid: null,
      acqOrderRef: null,
      libraryRef: null,
      organisationRef: null,
      receiptDate: DateTime.now().toISODate(),
      reference: null,
      amountAdjustments: [],
      notes: [],
      receiptLines: []
    };
  }

  /**
   * Create the base AcqReceipt data based on model
   * @param model: the model where to find the data.
   * @return: an object representing an AcqReceipt corresponding to the model.
   */
  processBaseRecord(model: IAcqReceiptModel): IAcqReceipt {
    return {
      acq_order: {
        $ref: model.acqOrderRef
      },
      library: {
        $ref: model.libraryRef
      },
      organisation: {
        $ref: model.organisationRef
      },
      amount_adjustments: [],
      notes: []
    };
  }

  processExistingRecord(record: IAcqReceipt): IAcqReceipt {
    return {
      pid: record.pid,
      $schema: record.$schema,
      acq_order: { $ref: this.apiService.getRefEndpoint('acq_orders', record.acq_order.pid) },
      library: { $ref: this.apiService.getRefEndpoint('libraries', record.library.pid) },
      organisation: { $ref: this.apiService.getRefEndpoint('organisation', record.organisation.pid) },
      reference: record.reference,
      amount_adjustments: record.amount_adjustments,
      notes: record.notes
    };
  }

  /**
   * Process adjustments from the model to create corresponding AcqReceiptAdjustment
   * @param model: the model where to found receipt adjustments
   * @return: an array of AcqReceiptAmountAdjustment
   */
   processAdjustments(model: IAcqReceiptModel): AcqReceiptAmountAdjustment[] {
    const adjustments = [];
    model.amountAdjustments.forEach((adj) => {
      const data = {
        label: adj.label,
        amount: adj.amount,
        acq_account: { $ref: adj.acqAccount }
      };
      adjustments.push(data);
    });
    return adjustments;
  }

  /**
   * Process lines from the model to create corresponding AcqReceiptLine
   * @param model: the model where found the receipt lines to process
   * @return: an array of AcqReceiptLine
   */
   processLines(model: IAcqReceiptModel): IAcqReceiptLine[] {
    const lines = [];
    model.receiptLines
    .filter(line => line.selected === true)
    .forEach((line: any) => {
      lines.push({
        acq_order_line: {
          $ref: line.acqOrderLineRef
        },
        quantity: line.quantity,
        amount: line.amount,
        vat_rate: line.vatRate,
        receipt_date: model.receiptDate
      });
    });
    return lines;
  }

  /**
   * Clean an AcqReceipt to remove useless data
   * @param record - IAcqReceipt
   * @return: the cleaned IAcqReceipt
   */
  cleanData(record: any): any {
    const fieldsToRemovedIfEmpty = ['amount_adjustments', 'notes'];
    fieldsToRemovedIfEmpty.forEach((key: string) => {
      if (record.hasOwnProperty(key) && record[key].length === 0) {
        delete record[key];
      }
    });
    return record;
  }
}
