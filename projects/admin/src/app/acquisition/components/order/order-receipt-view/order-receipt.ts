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

import moment from 'moment';
import { IReceiptOrder } from '../../../classes/receipt';

/** Interface for Receipt data */
export interface IReceiptModel {
  pid?: string;
  acqOrderRef: string;
  libraryRef: string;
  organisationRef: string;
  receiptDate: string;
  exchangeRate: number;
  amountAdjustments: IReceiptAmountAdjustment[];
  notes: IReceiptNoteModel[];
  receiveLines: {
    acqOrderLineRef: string,
    document: string,
    quantityMax: number,
    quantity: number,
    amount: number
  }[];
}

export interface IReceiptNoteModel {
  type: string;
  content: string;
}

export interface IReceiptAmountAdjustment {
  label: string;
  amount: number;
  acqAccount: string;
}

export interface IReceiptOrderLine {
  acq_receipt: {
    $ref: string;
  };
  acq_order_line: {
    $ref: string;
  };
  quantity: number;
  amount: number;
  receipt_date: string;
  organisation: {
    $ref: string;
  };
}

export interface IAcqRecordStatus {
  record: boolean;
  status: boolean;
}

export interface IReceiptLine {
  data: object;
  status: string;
  line?: object;
  error_message?: string;
}

export interface IResponseReceiptLine {
  response: IReceiptLine[];
}

export interface ICreateLineMessage {
  success: boolean;
  messages: string[];
}

export class OrderReceipt {
  /** Model */
  get model(): IReceiptModel {
    return {
      pid: null,
      acqOrderRef: null,
      libraryRef: null,
      organisationRef: null,
      receiptDate: moment().format(moment.HTML5_FMT.DATE),
      exchangeRate: 1,
      amountAdjustments: [],
      notes: [],
      receiveLines: []
    };
  }

  processBaseRecord(model: IReceiptModel): IReceiptOrder {
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
      exchange_rate: model.exchangeRate,
      amount_adjustments: [],
      notes: []
    };
  }

  /**
   * Process adjustment
   * @param model - ReceiptModel
   * @return array of adjustements
   */
   processAdjustments(model: IReceiptModel): any {
    const adjustements = [];
    model.amountAdjustments.forEach((adj) => {
      adjustements.push({
        label: adj.label,
        amount: adj.amount,
        acq_account: {
          $ref: adj.acqAccount
        }
      });
    });
    return adjustements;
  }

  /**
   * Process order line
   * @param model - ReceiptModel
   * @returns array of receipt_lines
   */
   processlines(model: IReceiptModel): IReceiptOrderLine[] {
    const lines = [];
    model.receiveLines.forEach((line: any) => {
      lines.push({
        acq_order_line: {
          $ref: line.acqOrderLineRef
        },
        quantity: line.quantity,
        amount: line.amount,
        receipt_date: model.receiptDate
      });
    });
    return lines;
  }

  /**
   * Clean Data
   * @param record - ReceiptOrder
   * @returns ReceiptOrder
   */
  cleanData(record: IReceiptOrder): IReceiptOrder {
    const fieldsToRemovedIfEmpty = ['amount_adjustments', 'notes'];
    fieldsToRemovedIfEmpty.forEach((key: string) => {
      if (record.hasOwnProperty(key) && record[key].length === 0) {
        delete record[key];
      }
    });
    return record;
  }
}
