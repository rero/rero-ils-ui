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

/* eslint-disable */
// required as json properties is not lowerCamelCase

import { IAcqBaseResource, IObjectReference } from './common';

/** Interface to describe an exceedance into an AcqAccount */
export class IExceedance {
  amount: number;
  value: number;
}

/** Interface to describe an encumbrance & expenditure amount */
export class IAccountingAmount {
  children: number;
  self: number;
  total: number;
}

/** Wrapping class to describe an AcqAccount */
export interface IAcqAccount extends IAcqBaseResource {
  name: string;
  number: string;
  depth: number;
  is_active: boolean;
  allocated_amount: number;
  encumbrance_exceedance?: IExceedance;
  expenditure_exceedance?: IExceedance;
  encumbrance_amount: IAccountingAmount;
  expenditure_amount: IAccountingAmount;
  remaining_balance: IAccountingAmount;
  distribution: number;
  budget: IObjectReference;
  parent: IObjectReference;
}
