// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

import { IAcqBaseResource, IAcqResourceWithNotes, IObjectReference } from './common';

// ACQ RECEIPT ================================================================
/** Wrapping class to describe an amount adjustment for a receipt */
export class AcqReceiptAmountAdjustment {
  label: string;
  amount: number;
  acq_account: IObjectReference;
}

/** Wrapping class to describe an AcqReceipt */
export type IAcqReceipt = {
  acq_order: IObjectReference;
  reference?: string;
  amount_adjustments: AcqReceiptAmountAdjustment[];
  currency?: string;
  quantity?: number;
  total_amount?: number;
  receipt_lines?: IAcqReceiptLine[];
} & IAcqBaseResource & IAcqResourceWithNotes

// ACQ RECEIPT LINE ===========================================================
export type IAcqReceiptLine = {
  acq_receipt: IObjectReference;
  acq_order_line: IObjectReference;
  quantity: number;
  amount: number;
  vat_rate: number;
  receipt_date: string;
  document?: {
    pid: string
    string: string,
    title_text: string,
    identifiers?: string[]
  }
} & IAcqBaseResource & IAcqResourceWithNotes

/** Default value for an AcqReceipt */
export const receiptDefaultData = {
  amount_adjustments: [],
  quantity: 0,
  total_amount: 0,
  receipt_lines: [],
  notes: []
};
export const receiptLineDefaultData = {
  quantity: 0,
  amount: 0,
  notes: []
};
