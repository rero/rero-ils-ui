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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { ObjectReference } from '@rero/shared';
import { AcqBaseResource, AcqNote } from './common';

// ACQ RECEIPT ================================================================
export interface IAcqReceipt {
  $schema?: string;
  pid?: string;
  acq_order: {
    $ref: string;
  };
  exchange_rate: number;
  amount_adjustments?: AcqReceiptAmountAdjustment[];
  notes?: AcqNote[];
  library: {
    $ref: string;
  };
  organisation: {
    $ref: string;
  };
}

/** Wrapping class to describe an amount adjustment for a receipt */
export class AcqReceiptAmountAdjustment {
  label: string;
  amount: number;
  acq_account: ObjectReference;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

/** Wrapping class to describe an AcqReceipt */
export class AcqReceipt extends AcqBaseResource {
  $schema: string = null;
  pid: string = null;
  acq_order: ObjectReference;
  exchange_rate: number = 1;
  amount_adjustments: AcqReceiptAmountAdjustment[] = [];
  notes: AcqNote[] = [];

  // Serialized keys
  currency: string = undefined;
  quantity: number = 0;
  total_amount: number = 0;
  receipt_lines: AcqReceiptLine[] = [];

  // default relation object
  library: ObjectReference;
  organisation: ObjectReference;

  /**
   * Constructor
   * @param obj: the JSON parsed object to load
   */
  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
    this.library = new ObjectReference(obj.library);
    this.organisation = new ObjectReference(obj.organisation);
    for(const [idx, data] of this.receipt_lines.entries()) {
      this.receipt_lines[idx] = new AcqReceiptLine(data);
    }
    for(const [idx, data] of this.amount_adjustments.entries()) {
      this.amount_adjustments[idx] = new AcqReceiptAmountAdjustment(data);
    }
  }

  /** Get the label for this receipt.
   *  NOTE : The best label should be a `reference` field from the resource. But
   *         this field doesn't exists and seems not relevant. So instead of a label
   *         the reception dates are the best labels possible.
   *  @return: the label to use for this receipt as string.
   */
  get label(): string {
    const dates = new Set(this.receipt_lines.map(line => line.receipt_date));
    return [...dates].join(', ');
  }
}

// ACQ RECEIPT LINE ===========================================================
export interface IAcqReceiptLine {
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

export class AcqReceiptLine {
  pid: string;
  quantity: number = 0;
  amount: number = 0;
  receipt_date: Date;
  document: {
    pid: string
    string: string,
    title: string,
    identifiers?: string[]
  } = undefined;
  notes?: string[] = [];

  /**
   * Constructor
   * @param obj: the JSON parsed object to load
   */
  constructor(obj?: any){
    Object.assign(this, obj);
  }

  get total_amount(): number {
    return this.quantity * this.amount;
  }
}
