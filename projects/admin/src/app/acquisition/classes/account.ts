/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
  remaining_balance?: IAccountingAmount;
  distribution: number;
  budget: IObjectReference;
  parent: IObjectReference;
  number_of_children?: number;
}


/** Default values */
const exceedanceDefaultData = {
  amount: 0,
  value: 0
};

const allocatedAmountDefaultData = {
  self: 0,
  children: 0,
  total: 0
};

export const accountDefaultData = {
  name: '',
  number: '',
  depth: 0,
  is_active: false,
  allocated_amount: 0,
  distribution: 0,
  encumbrance_exceedance: exceedanceDefaultData,
  expenditure_exceedance: exceedanceDefaultData,
  encumbrance_amount: allocatedAmountDefaultData,
  expenditure_amount: allocatedAmountDefaultData,
  remaining_balance: allocatedAmountDefaultData
};
