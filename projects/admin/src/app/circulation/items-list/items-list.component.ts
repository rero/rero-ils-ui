// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { IdAttributePipe, OpenCloseButtonComponent, User } from '@rero/shared';

import { ItemAction } from '../../classes/items';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'admin-circulation-items-list',
  templateUrl: './items-list.component.html',
  imports: [OpenCloseButtonComponent, Bind, Button, ItemComponent, IdAttributePipe, TranslatePipe, CardModule],
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
    this.extendAllLoansClicked.emit(
      this.loansToExtend.map((item) => {
        item.currentAction = ItemAction.extend_loan;
        return item;
      }),
    );
  }

  /** Get loans that can be extended */
  get loansToExtend() {
    return this.checkedOutItems().filter((item) => item.actions.includes(ItemAction.extend_loan));
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
