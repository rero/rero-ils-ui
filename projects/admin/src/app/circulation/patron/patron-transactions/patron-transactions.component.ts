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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@rero/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Loan, LoanOverduePreview } from '../../../classes/loans';
import { OrganisationService } from '../../../service/organisation.service';
import { PatronService } from '../../../service/patron.service';
import { PatronTransaction, PatronTransactionStatus } from '../../classes/patron-transaction';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';

@Component({
  selector: 'admin-patron-transactions',
  templateUrl: './patron-transactions.component.html',
  styleUrls: ['./patron-transactions.component.scss']
})
export class PatronTransactionsComponent implements OnInit, OnDestroy {

  // COMPONENTS ATTRIBUTES ===============================================================
  /** Subscription to PatronTransaction.service.ts --> patronTransactionByPatronSubject */
  patronTransactionSubscription$: Subscription;
  /** all tab reference array */
  tabs = {
    engagedFees: {
      isOpen: true,  // open by default
      transactions: [] as Array<PatronTransaction>,
      totalAmount: 0
    },
    overduePreviewFees: {
      isOpen: false,
      transactions: [] as Array<{fees: LoanOverduePreview, loan: Loan}>,
      totalAmount: 0
    },
    historyFees: {
      isOpen: false,
      transactions: null as Array<PatronTransaction>
    }
  };

  /** Current patron */
  private _patron: any = undefined;


  // GETTER & SETTER ======================================================================
  /**
   * Get current organisation
   * @return current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }


  // CONSTRUCTOR & HOOKS ==================================================================
  /**
   * constructor
   * @param _patronService - PatronService
   * @param _organisationService - OrganisationService
   * @param _patronTransactionService - PatronTransactionService
   * @param _modalService - BsModalService
   */
  constructor(
    private _patronService: PatronService,
    private _organisationService: OrganisationService,
    private _patronTransactionService: PatronTransactionService,
    private _modalService: BsModalService,
    private _userService: UserService
  ) {}

  /** OnInit hook */
  ngOnInit() {
    this._patronService.currentPatron$.subscribe((patron: any) => {
      if (patron) {
        this._patron = patron;
        // engaged fees
        this.patronTransactionSubscription$ = this._patronTransactionService.patronTransactionsSubject$.subscribe(
          (transactions) => {
            this.tabs.engagedFees.transactions = transactions;
            this.tabs.engagedFees.totalAmount = this._patronTransactionService.computeTotalTransactionsAmount(transactions);
          }
        );
        this._patronTransactionService.emitPatronTransactionByPatron(patron.pid, undefined, 'open');
        // overdue fees
        this._patronService.getOverduesPreview(this._patron.pid).subscribe(
          (overdues) => {
            this.tabs.overduePreviewFees.transactions = overdues;
            this.tabs.overduePreviewFees.totalAmount = overdues.reduce((acc, overdue) => acc + overdue.fees.total, 0);
          }
        );
      }
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this.patronTransactionSubscription$) {
      this.patronTransactionSubscription$.unsubscribe();
    }
  }

  // COMPONENT FUNCTIONS ==================================================================
  /** load all PatronTransactions for the patron without 'status' restriction */
  loadFeesHistory() {
    if (this._patron && this.tabs.historyFees.transactions === null) {
      this._patronTransactionService
        .patronTransactionsByPatron$(this._patron.pid, undefined, PatronTransactionStatus.CLOSED.toString())
        .subscribe(transactions => {
          this.tabs.historyFees.transactions = transactions;
        });
    }
  }

  /** Allow to pay the total of each pending patron transactions */
  public payAllTransactions() {
    const initialState = {
      action: 'pay',
      mode: 'full',
      transactions: this.tabs.engagedFees.transactions
    };
    this._modalService.show(PatronTransactionEventFormComponent, {initialState});
  }
    get myLibraryEngagedFees() {
      const libraryPID = this._userService.user.currentLibrary;
      return this.tabs.engagedFees.transactions.filter(t => t.library != null && t.library.pid === libraryPID);
    }

    /** Allow to pay the total of each pending patron transactions */
    public payAllTransactionsInMyLibrary() {
      const initialState = {
        action: 'pay',
        mode: 'full',
        transactions: this.myLibraryEngagedFees
      };
      this._modalService.show(PatronTransactionEventFormComponent, {initialState});
    }

  /**
   * Behavior to perform when user asked to open a 'vertical tab'.
   * All other tabs will be hidden.
   * @param tabToOpen: the tab to open
   */
  openTab(tabToOpen): void {
    for (const entry of Object.values(this.tabs)) {
      entry.isOpen = tabToOpen === entry;
    }
  }
}
