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

import { ObjectReference } from '../../classes/core';

// ORDER ======================================================================
/** Interface for order recipient */
export interface AcqAddressRecipient {
  type: string;
  address: string;
}

/** Enumeration about order status */
export enum AcqOrderStatus {
  CANCELED = 'canceled',
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

/** Enumeration about note type */
export enum AcqNoteType {
  STAFF_NOTE = 'staff_note',
  VENDOR_NOTE = 'vendor_note'
}

/** Interface to describe an order note */
export class AcqNote {
  type: AcqNoteType = null;
  content: string = null;
}

/** Wrapping class to describe an AcqAccount */
export class AcqOrder {
  $schema: string = null;
  pid: string = null;
  reference: string = null;
  priority: number = 0;
  type: AcqOrderType = AcqOrderType.MONOGRAPH;
  status: AcqOrderStatus = AcqOrderStatus.PENDING;
  currency: string = null;
  notes: Array<AcqNote> = [];
  vendor: ObjectReference;
  library: ObjectReference;
  organisation: ObjectReference;
  total_amount: number = 0;
  order_date: Date = null;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    Object.assign(this, obj);
  }
}

// ORDER LINES ================================================================
/** Enumeration about order line status */
export enum AcqOrderLineStatus {
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  ORDERED = 'ordered',
  RECEIVED = 'received'
}

/** Wrapping class to describe an OrderLine */
export class AcqOrderLine {
  $schema: string = null;
  pid: string = null;
  status: AcqOrderLineStatus = AcqOrderLineStatus.APPROVED;
  priority: number = 0;
  quantity: number = 0;
  amount: number = 0;
  discount_amount: number = 0;
  total_amount: number = 0;
  exchange_rate: number = 0;
  notes: Array<AcqNote> = [];
  order_date: Date = null;
  reception_date: Date = null;

  acq_account: ObjectReference = null;
  acq_order: ObjectReference = null;
  document: ObjectReference = null;
  organisation: ObjectReference = null;
  library: ObjectReference = null;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    Object.assign(this, obj);
  }
}


// ORDER PREVIEW
export class AcqOrderPreview {
  data: any;
  preview: string;
  message?: Array<{
    type: string,
    content: string
  }>;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    Object.assign(this, obj);
  }

  get content(): string{
    return this.preview.substring(this.preview.indexOf('\n')+1).trim();
  }
}
