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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../class/user';
import { ItemAction } from '../../class/items';

@Component({
  selector: 'admin-circulation-items-list',
  templateUrl: './items-list.component.html'
})
export class ItemsListComponent {

  /** Items of the checked out list */
  @Input() checkedOutItems: any[];

  /** Items of the checked in list */
  @Input() checkedInItems: any[];

  /** Current patron */
  @Input() patron: User;

  /** Extend (renew) all event emitter */
  @Output() extendAllLoansClicked = new EventEmitter<any[]>();

  /** Extend loan event emitter */
  @Output() extendLoanClicked = new EventEmitter<any[]>();

  /** Item has fees */
  @Output() hasFeesEmitter = new EventEmitter<boolean>();

  /** Extend loan item action */
  extendLoan = ItemAction.extend_loan;

  /** Constructor */
  constructor(
  ) {
    this.checkedOutItems = null;
  }

  /** Extend loan
   * @param event: event
   * @param item: current item
   */
  extendLoanClick(event: any, item) {
    item.currentAction = ItemAction.extend_loan;
    this.extendLoanClicked.emit(item);
  }

  /** Extend all */
  extendAllLoansClick() {
    this.extendAllLoansClicked.emit(this.loansToExtend.map(item => {
      item.currentAction = ItemAction.extend_loan;
      return item;
    }));
  }

  /** Get loans that can be extended */
  get loansToExtend() {
    return this.checkedOutItems.filter(item => item.actions.includes(ItemAction.extend_loan));
  }

  /** Check if current loan has fees
   * @param event: value received from child component
   */
   hasFees(event: boolean) {
    this.hasFeesEmitter.emit(event);
    return event;
  }
}
