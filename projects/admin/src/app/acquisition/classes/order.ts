/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 * Copyright (C) 2021-2023 UCLouvain
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

// required as json properties is not lowerCamelCase
import { extractIdOnRef } from '@rero/ng-core';
import { IAcqBaseResource, IAcqResourceWithNotes, IObjectReference } from './common';

// ORDER ======================================================================
/** Interface for order recipient */
export interface AcqAddressRecipient {
  type: string;
  address: string;
}

/** Enumeration about order status */
export enum AcqOrderStatus {
  CANCELLED = 'cancelled',
  ORDERED = 'ordered',
  PENDING = 'pending',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
}

/** interface to describe an accounting information section for an AcqOrder */
export interface IAcqOrderAccountingInformation {
  total_amount: number;
  quantity: number;
}

/** interface to describe an AcqOrder */
export interface IAcqOrder extends IAcqBaseResource, IAcqResourceWithNotes {
  reference: string;
  priority: number;
  status: AcqOrderStatus;
  currency: string;
  order_date: Date;
  account_statement: {
    provisional: IAcqOrderAccountingInformation,
    expenditure: IAcqOrderAccountingInformation
  }
  order_lines?: {}[];
  vendor: IObjectReference;
  is_current_budget: boolean;
}

/** Default values */
export const orderDefaultData = {
  priority: 0,
  status: AcqOrderStatus.PENDING,
  notes: []
};

// ORDER LINES ================================================================
/** Enumeration about order line status */
export enum AcqOrderLineStatus {
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  ORDERED = 'ordered',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received'
}

/** Interface to describe an OrderLine */
export interface IAcqOrderLine extends IAcqBaseResource, IAcqResourceWithNotes {
  status: AcqOrderLineStatus;
  priority: number;
  quantity: number;
  received_quantity: number;
  amount: number;
  discount_amount: number;
  total_amount: number;
  acq_account: IObjectReference;
  acq_order: IObjectReference;
  document: IObjectReference|{
    pid: string,
    title: string,
    identifiers: string[],
  };
}

/** Default values */
export const orderLineDefaultData = {
  status: AcqOrderLineStatus.APPROVED,
  priority: 0,
  quantity: 0,
  received_quantity: 0,
  amount: 0,
  total_amount: 0,
  notes: []
};

// ORDER HISTORY ==============================================================
export interface AcqOrderHistoryVersionResponseInterface {
  $ref: string;
  label: string;
  description: string;
  created: Date;
  updated: Date;
  current: boolean;
}
export class AcqOrderHistoryVersion {
  label: string = null;
  description: string = null;
  pid: string = null;
  active = false;
  created: Date = null;
  updated: Date = null;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any) {
    Object.assign(this, obj);
    this.active = obj.current;
    this.pid = extractIdOnRef(obj.$ref);
  }
}




