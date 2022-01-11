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
import { IAcqReceipt } from '../classes/receipt';

@Pipe({
  name: 'receptionDates'
})
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
