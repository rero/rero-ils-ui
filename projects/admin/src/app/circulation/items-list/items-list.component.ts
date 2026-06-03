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

import { Component, input, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { User, OpenCloseButtonComponent, IdAttributePipe } from '@rero/shared';
import { ItemAction } from '../../classes/items';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { ItemComponent } from '../item/item.component';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'admin-circulation-items-list',
    templateUrl: './items-list.component.html',
    imports: [TranslateDirective, OpenCloseButtonComponent, Bind, Button, ItemComponent, IdAttributePipe, TranslatePipe, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsListComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Items of the checked out list */
  checkedOutItems = input<any[]>();
  /** Items of the checked in list */
  checkedInItems = input<any[]>();
  /** Current patron */
  patron = input<User>();

  /** Extend (renew) all event emitter */
  extendAllLoansClicked = output<any[]>();
  /** Extend loan event emitter */
  extendLoanClicked = output<any[]>();
  /** Item has fees */
  hasFeesEmitter = output<boolean>();

  readonly allCollapsed = signal(true);

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor */
  // COMPONENT FUNCTIONS ======================================================
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
    return this.checkedOutItems().filter(item => item.actions.includes(ItemAction.extend_loan));
  }

  /**
   * Check if current loan has fees
   * @param event: value received from child component
   */
   hasFees(event: boolean) {
    this.hasFeesEmitter.emit(event);
    return event;
  }
}
