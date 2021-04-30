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

import { Moment } from 'moment';
import { ItemStatus, User } from '@rero/shared';
import { Loan } from './loans'

export enum ItemNoteType {
  GENERAL = 'general_note',
  STAFF = 'staff_note',
  CHECKIN = 'checkin_note',
  CHECKOUT = 'checkout_note',
  BINDING = 'binding_note',
  PROVENANCE = 'provenance_note',
  CONDITION = 'condition_note',
  PATRIMONIAL = 'patrimonial_note',
  ACQUISITION = 'acquisition_note',
}

export interface Organisation {
  pid: string
}

export interface Document {
  pid: string;
  title: string;
}

export enum ItemAction {
  checkout = 'checkout',
  checkin = 'checkin',
  request = 'request',
  lose = 'lose',
  receive = 'receive',
  return_missing = 'return_missing',
  extend_loan = 'extend_loan',
  validate = 'validate',
  no = 'no'
}

type ItemActionObjectType<R> = {[key in keyof typeof ItemAction]: R };

export class ItemNote {
  type: ItemNoteType;
  content: string;
}

export enum ItemType {
  STANDARD = 'standard',
  ISSUE = 'issue'
}

export class Item {

  static PUBLIC_NOTE_TYPES: ItemNoteType[] = [
    ItemNoteType.GENERAL,
    ItemNoteType.BINDING,
    ItemNoteType.PROVENANCE,
    ItemNoteType.CONDITION,
    ItemNoteType.PATRIMONIAL
  ];

  available: boolean;
  barcode: string;
  call_number: string;
  document: any;
  status: ItemStatus;
  organisation: Organisation;
  pid: string;
  requests_count: number;
  action_applied?: ItemActionObjectType<object>;
  _currentAction: ItemAction;
  actionDone: ItemAction;
  loan: Loan;
  actions: ItemAction[] = [];
  pending_loans: Loan[];
  number_of_extensions: number;
  location: any;
  notes: ItemNote[];
  acquisition_date: Moment;
  enumerationAndChronology: string;


  constructor(obj?: any) {
    Object.assign(this, obj);
    if (obj.pending_loans) {
      this.pending_loans = obj.pending_loans.map(loan => new Loan(loan));
    }
    if (this.actions !== undefined) {
      this.actions.unshift(ItemAction.no);
    }
  }

  setLoan(obj?: any) {
    this.loan = new Loan(obj);
  }

  public set currentAction(action: ItemAction) {
    this._currentAction = action;
  }
  public get currentAction() {
    if (this._currentAction) {
      return this._currentAction;
    }
    return ItemAction.no;
  }

  public isActionLoan() {
    return this.currentAction === ItemAction.checkout;
  }

  public isActionReturn() {
    return this.currentAction === ItemAction.checkin;
  }

  public requestedPosition(patron: User) {
    return (!patron || !this.pending_loans)
      ? 0
      : this.pending_loans.findIndex(loan => loan.patron_pid === patron.patronLibrarian.pid) + 1;
  }

  public get hasRequests() {
    return (this.pending_loans && this.pending_loans.length > 0);
  }

  /** Search on item notes a note corresponding to the note type
   *
   * @param type: the note type
   * @return Return the corresponding note or null if not found
   */
  public getNote(type: ItemNoteType): ItemNote | null {
    if (this.notes == null) {
      return null;
    }
    const filteredNotes = this.notes.filter(note => note.type === type);
    return (filteredNotes)
      ? filteredNotes[0]
      : null;
  }
}
