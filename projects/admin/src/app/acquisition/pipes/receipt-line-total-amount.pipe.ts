/*
 * RERO ILS UI
 * Copyright (C) 2021 UCLouvain
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

import { Pipe, PipeTransform } from '@angular/core';
import { IAcqReceiptLine } from '../classes/receipt';

@Pipe({
    name: 'receiptLineTotalAmount',
    standalone: false
})
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
