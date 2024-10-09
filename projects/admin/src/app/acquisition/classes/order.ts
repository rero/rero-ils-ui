/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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

/* tslint:disable */
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

/** Enumeration about order type */
export enum AcqOrderType {
  MONOGRAPH = 'monograph',
  SERIAL = 'serial',
  STANDING_ORDER = 'standing_order',
  MONOGRAPHIC_SET = 'monographic_set',
  PLANNED_ORDER = 'planned_order',
  MULTI_VOLUME = 'multi_volume'
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
  type: AcqOrderType;
  status: AcqOrderStatus;
  currency: string;
  order_date: Date;
  account_statement: {
    provisional: IAcqOrderAccountingInformation,
    expenditure: IAcqOrderAccountingInformation
  }
  order_lines?: {
    order_date: Date,
    receipt_date: Date,
  }[];
  vendor: IObjectReference;
  is_current_budget: boolean;
}

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
  exchange_rate: number;
  order_date: Date;
  receipt_date: Date;
  acq_account: IObjectReference;
  acq_order: IObjectReference;
  document: IObjectReference|{
    pid: string,
    title: string,
    identifiers: string[],
  };
}


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
  active: boolean = false;
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
