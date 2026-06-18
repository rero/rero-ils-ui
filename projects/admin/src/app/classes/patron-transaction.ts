// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

import { DateTime } from 'luxon';

export enum PatronTransactionStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}
export enum PatronTransactionEventType {
  FEE = 'fee',
  PAYMENT = 'payment',
  DISPUTE = 'dispute',
  CANCEL = 'cancel'
}

export class PatronTransaction {

  pid: string;
  creation_date: string;
  type: string;
  status: PatronTransactionStatus = PatronTransactionStatus.OPEN;
  total_amount = 0;
  events: PatronTransactionEvent[] = [];
  note?: string = null;
  document?: any = null;
  library?: any = null;
  loan?: any = null;
  patron: any = null;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }

  /** Get events linked to the transaction sorted by creation date
   *  @return Array<PatronTransactionEvent>
   */
  get_events(): PatronTransactionEvent[] {
    return this.events.sort((e1, e2) => {
      const e1_date = DateTime.fromISO(e1.creation_date);
      const e2_date = DateTime.fromISO(e2.creation_date);
      return e2_date.diff(e1_date);
    });
  }
}


export class PatronTransactionEvent {

  pid?: string;
  creation_date: string = null;
  amount = 0;
  type: PatronTransactionEventType;
  subtype?: string;
  note?: string;
  library?: any;
  operator: any;
  parent: PatronTransaction;
  steps?: {timestamp: string, amount: string}[];

  constructor(obj?: any){
    Object.assign(this, obj);
  }
}
