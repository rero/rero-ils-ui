// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

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
export type IAcqAccount = {
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
} & IAcqBaseResource


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
