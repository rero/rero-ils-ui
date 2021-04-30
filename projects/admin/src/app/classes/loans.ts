/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import moment, { Moment } from 'moment';

// ENUM ========================================================================
/** All possible state about a loan */
export enum LoanState {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  ITEM_ON_LOAN = 'ITEM_ON_LOAN',
  ITEM_RETURNED = 'ITEM_RETURNED',
  ITEM_IN_TRANSIT_FOR_PICKUP = 'ITEM_IN_TRANSIT_FOR_PICKUP',
  ITEM_IN_TRANSIT_TO_HOUSE = 'ITEM_IN_TRANSIT_TO_HOUSE',
  ITEM_AT_DESK = 'ITEM_AT_DESK',
  CANCELLED = 'CANCELLED'
}

// INTERFACE ===================================================================
/** Interface representing a overdue preview API response about a Loan. */
export interface LoanOverduePreview {
  steps: Array<any>;
  total: number;
}

// CLASSES =====================================================================
export class LoanDestination {
  location_name?: string;
  library_name?: string;
  library_code?: string;
  location_code?: string;

  constructor(obj?: any) {
    Object.assign(this, obj)
  }
}

export class Loan {
  pid?: string;
  state: LoanState;
  transaction_date?: Moment;
  patron_pid?: string;
  document_pid?: string;
  item_pid?: {type: string, value: string};
  start_date?: Moment;
  end_date?: Moment;
  request_expire_date?: Moment;
  pickup_location_pid?: string;
  item_destination?: LoanDestination;
  transaction_location_pid?: string;

  /**
   * Constructor
   * @param obj: a JSON representation of the object
   */
  constructor(obj?: any) {
    Object.assign(this, obj);
    this.request_expire_date = Loan._convertToMoment(this.request_expire_date);
    this.start_date = Loan._convertToMoment(this.start_date);
    this.end_date = Loan._convertToMoment(this.end_date);
    this.transaction_date = Loan._convertToMoment(this.transaction_date);
  }

  /**
   * Convert a string representation of a date to a `moment`
   * @param data: the date to parse
   */
  private static _convertToMoment(data): moment|null {
    return (data)
      ? moment(data)
      : null;
  }

  /** Return the due date about the loan */
  get dueDate(): moment {
    switch (this.state) {
      case LoanState.PENDING: return this.request_expire_date;
      case LoanState.ITEM_ON_LOAN: return this.end_date;
      default: return null;
    }
  }

  /** Is the loan is expired or not ? */
  public get expired(): boolean {
    return (this.dueDate)
      ? this.dueDate.isBefore(new Date())
      : false;
  }
}
