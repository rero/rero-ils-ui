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
import { AcqBaseResource } from './common';

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

/** Interface to describe item quantity for an order */
export class AcqOrderItemQuantity {
  ordered: number = 0;
  received: number = 0;
}

/** Wrapping class to describe an AcqAccount */
export class AcqOrder extends AcqBaseResource {
  $schema: string = null;
  pid: string = null;
  reference: string = null;
  priority: number = 0;
  type: AcqOrderType = AcqOrderType.MONOGRAPH;
  status: AcqOrderStatus = AcqOrderStatus.PENDING;
  currency: string = null;
  total_amount: number = 0;
  order_date: Date = null;
  item_quantity: AcqOrderItemQuantity;

  vendor: ObjectReference;
  library: ObjectReference;
  organisation: ObjectReference;


  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    super();
    Object.assign(this, obj);
    if (obj.hasOwnProperty('library')) {
      this.library = new ObjectReference(obj.library);
    }
    if (obj.hasOwnProperty('organisation')) {
      this.organisation = new ObjectReference(obj.organisation);
    }
    if (obj.hasOwnProperty('vendor')) {
      this.vendor = new ObjectReference(obj.vendor);
    }
  }
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

/** Wrapping class to describe an OrderLine */
export class AcqOrderLine extends AcqBaseResource{
  $schema: string = null;
  pid: string = null;
  status: AcqOrderLineStatus = AcqOrderLineStatus.APPROVED;
  priority: number = 0;
  quantity: number = 0;
  received_quantity: number = 0;
  amount: number = 0;
  discount_amount: number = 0;
  total_amount: number = 0;
  exchange_rate: number = 0;
  order_date: Date = null;
  reception_date: Date = null;

  library: ObjectReference;
  organisation: ObjectReference;
  acq_account: ObjectReference;
  acq_order: ObjectReference;
  document: ObjectReference;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    super();
    Object.assign(this, obj);
    this.library = new ObjectReference(obj.library);
    this.organisation = new ObjectReference(obj.organisation);
    this.acq_account = new ObjectReference(obj.acq_account);
    this.acq_order = new ObjectReference(obj.acq_order);
    if (obj.hasOwnProperty('document')) {
      this.document = new ObjectReference(obj.document);
    }
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

export interface IAcqOrderLine {
  $chema: string;
  pid: string;
  status: string;
  priority: string;
  quantity: number;
  received_quantity: number;
  amount: number;
  total_amount: number;
  exchange_rate: number;
  notes: INotes[];
  order_date: string;
  reception_date?: string;
  acq_account: string;
  acq_order: string;
  document: string;
  organisation: string;
  library: string;
}

export interface INotes {
  type: string;
  content: string;
}
