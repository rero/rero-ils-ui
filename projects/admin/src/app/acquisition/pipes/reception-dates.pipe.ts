// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';
import { IAcqReceipt } from '../classes/receipt';

@Pipe({ name: 'receptionDates' })
export class ReceptionDatesPipe implements PipeTransform {

  /**
   * Get an array of reception dates related to a AcqReceipt
   * @param receipt - the receipt to analyze.
   * @returns the array of reception dates.
   */
  transform(receipt: IAcqReceipt): string[] {
    const dates = new Set(receipt.receipt_lines.map(line => line.receipt_date));
    return (dates.size > 0)
      ? [...dates].sort().reverse()
      : [];
  }

}
