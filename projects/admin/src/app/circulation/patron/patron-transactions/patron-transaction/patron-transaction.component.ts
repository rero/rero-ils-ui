/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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

import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { PatronTransaction, PatronTransactionEventType, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { OrganisationService } from '@app/admin/service/organisation.service';
import {
  PatronTransactionEventFormComponent
} from '../patron-transaction-event-form/patron-transaction-event-form.component';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'admin-patron-transaction',
  templateUrl: './patron-transaction.component.html'
})
export class PatronTransactionComponent implements OnInit {

  private dialogService: DialogService = inject(DialogService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private router: ActivatedRoute = inject(ActivatedRoute);

  // COMPONENT ATTRIBUTES ============================================
  /** Patron transaction */
  @Input() transaction: PatronTransaction;
  /** Is collapsed */
  isCollapsed = true;
  /** reference to PatronTransactionStatus -- used in HTML template */
  patronTransactionStatus = PatronTransactionStatus;

  // GETTER & SETTER ================================================
  /** get the total amount for a patron transaction :
   *  If transaction is still open, then return the total transaction amount
   *  If transaction is closed, then transaction total amount should be zero. In this case, the transaction will be
   *  displayed into history and for this part, it's better to display the initial/total due instead of
   *  still due amount.
   *  @return: the transaction total amount to display depending of transaction status
   */
  get transactionAmount(): number {
    if (this.transaction.status === PatronTransactionStatus.OPEN) {
      return this.transaction.total_amount;
    } else {
      let amount = 0;
      for (const event of this.transaction.get_events()) {
        if (event.type === PatronTransactionEventType.FEE) {
          amount += event.amount;
        }
      }
      return amount;
    }
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }
  // HOOKS ============================================
  /** OnInit hook */
  ngOnInit(): void {
    if (this.transaction) {
      // Open the current event if the url parameter match with transaction pid
      if (this.router.snapshot.queryParams.event === this.transaction.pid) {
        this.isCollapsed = false;
      }
      this.patronTransactionService.loadTransactionHistory(this.transaction);
    }
  }

  // COMPONENT FUNCTIONS ========================================================

  /** Check if the transaction contains a 'dispute' linked event
   *  @return: True if transaction is still open and contains a 'dispute' event; False otherwise
   */
  public isDisputed(): boolean {
    return (this.transaction.status === PatronTransactionStatus.OPEN)
      ? this.transaction.events.some( e => e.type === PatronTransactionEventType.DISPUTE)
      : false;
  }

  /**
   * Execute an action about the transaction using a custom form into a modal window
   * @param action: the action to execute (pay, dispute, resolve)
   * @param model: if action == 'pay', if we pay a part or the total amount of the transaction ('part'|'full')
   */
  patronTransactionAction(action: string, mode?: string): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      data: {
        action,
        mode,
        transactions: [this.transaction]
      }
    })
  }
}
