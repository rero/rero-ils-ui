// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Pipe, PipeTransform } from '@angular/core';
import { IAcqReceiptLine } from '../classes/receipt';

@Pipe({ name: 'receiptLineTotalAmount' })
export class ReceiptLineTotalAmountPipe implements PipeTransform {

  /**
   * Compute the total amount for a receipt line
   * @param receiptLine - the receipt line to process
   * @returns the total amount for this receipt line
   */
  transform(receiptLine: IAcqReceiptLine): number {
    const vatRate = (receiptLine.vat_rate !== undefined) ? 1 + receiptLine.vat_rate / 100 : 1;
    return receiptLine.quantity * receiptLine.amount * vatRate;
  }

}
