/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { IAcqAccount } from '../classes/account';

@Pipe({
    name: 'accountAvailableAmount',
    standalone: false
})
export class AccountAvailableAmountPipe implements PipeTransform {

  /**
   * Get the self available amount for an AcqAccount.
   * This amount is the result of the following calculation : allocated_amount - children distribution
   * @param account - the account to analyze.
   * @returns the available amount
   */
  transform(account: IAcqAccount): number {
    return account.allocated_amount - account.distribution;
  }

}
