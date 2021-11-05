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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { ObjectReference } from '@rero/shared';

/** Interface to describe an exceedance into an AcqAccount */
export class Exceedance {
  amount: number = 0;
  value: number = 0;
}

/** Interface to describe an encumbrance & expenditure amount */
export class AccountingAmount {
  children: number = 0;
  self: number = 0;
  total: number = 0;
}

/** Wrapping class to describe an AcqAccount */
export class AcqAccount {
  $schema: string = null;
  pid: string = null;
  name: string = '';
  number: string = '';
  depth: number = 0;
  is_active: boolean = false;

  allocated_amount: number = 0;
  encumbrance_exceedance?: Exceedance = new Exceedance();
  expenditure_exceedance?: Exceedance = new Exceedance();
  encumbrance_amount: AccountingAmount = new AccountingAmount();
  expenditure_amount: AccountingAmount = new AccountingAmount();
  remaining_balance: AccountingAmount = new AccountingAmount();
  distribution: number = 0;

  organisation: ObjectReference;
  library:ObjectReference;
  budget: ObjectReference;
  parent: ObjectReference;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    Object.assign(this, obj);
  }

  /**
   * Get the available amount for this account.
   * This amount represents the initial allocated amount reduces by children distribution
   * @return: The available amount
   */
  get available_amount(): number {
    return this.allocated_amount - this.distribution;
  }

}
