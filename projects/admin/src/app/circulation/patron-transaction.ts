/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import * as moment from 'moment';

export function _(str) {
  return marker(str);
}

export enum PatronTransactionStatus {
  OPEN = _('open'),
  CLOSED = _('closed')
}
export enum PatronTransactionEventType {
  FEE = _('fee'),
  PAYMENT = _('payment'),
  DISPUTE = _('dispute'),
  CANCEL = _('cancel')
}

export class PatronTransaction {

  pid: string;
  creation_date: string;
  type: string;
  status: PatronTransactionStatus = PatronTransactionStatus.OPEN;
  total_amount: number = 0;
  events: Array<PatronTransactionEvent> = [];
  note?: string = null;
  document?: any = null;
  loan?: any = null;
  patron: any = null;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }

  /** Get events linked to the transaction sorted by creation date
   *  @return Array<PatronTransactionEvent>
   */
  get_events(): Array<PatronTransactionEvent> {
    return this.events.sort((e1, e2) => {
      const e1_moment = moment(e1.creation_date);
      const e2_moment = moment(e2.creation_date);
      return e2_moment.diff(e1_moment);
    });
  }
}


export class PatronTransactionEvent {

  pid: string;
  creation_date: string = null;
  amount: number = 0;
  type: PatronTransactionEventType;
  subtype?: string;
  note?: string;
  library?: any;
  operator: any;
  parent: PatronTransaction;

  constructor(obj?: any){
    Object.assign(this, obj);
  }
}
