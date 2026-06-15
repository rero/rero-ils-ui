/*
 * RERO ILS UI
 * Copyright (C) 2021-2026 RERO
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

import { CurrencyPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'centsCurrency' })
export class CentsCurrencyPipe implements PipeTransform {

  private currencyPipe: CurrencyPipe = inject(CurrencyPipe);

  /**
   * Format a cents integer as a currency string.
   * @param amount - the amount in cents (integer).
   * @param currencyCode - ISO 4217 currency code.
   * @param display - currency display format (default 'symbol').
   * @returns the formatted currency string.
   */
  transform(amount: number, currencyCode: string, display = 'symbol'): string | null {
    return this.currencyPipe.transform(amount / 100, currencyCode, display);
  }

}
