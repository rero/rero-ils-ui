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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loan, LoanOverduePreview } from '@app/admin/classes/loans';
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronService } from '@app/admin/service/patron.service';
import { UserService } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { PatronFeeComponent } from './patron-fee/patron-fee.component';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';

@Component({
  selector: 'admin-patron-transactions',
  templateUrl: './patron-transactions.component.html',
  styleUrls: ['./patron-transactions.component.scss']
})
export class PatronTransactionsComponent implements OnInit, OnDestroy {

  // COMPONENTS ATTRIBUTES ===============================================================
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
  private patron: any = undefined;
  /** Modal used for manual fee */
  private modalRef: BsModalRef;
  /** Component subscriptions */
  private subscriptions = new Subscription();


  // GETTER & SETTER ======================================================================
  /**
   * Get current organisation
   * @return current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }

  /**
   * Get engaged fees related to the current user library
   * @return the list of corresponding transactions.
   */
  get myLibraryEngagedFees(): Array<PatronTransaction> {
    const libraryPID = this.userService.user.currentLibrary;
    return this.tabs.engagedFees.transactions.filter(t => t.library != null && t.library.pid === libraryPID);
  }


  // CONSTRUCTOR & HOOKS ==================================================================
  /**
   * constructor
   * @param patronService - PatronService
   * @param organisationService - OrganisationService
   * @param patronTransactionService - PatronTransactionService
   * @param modalService - BsModalService
   * @param userService - UserService
   */
  constructor(
    private patronService: PatronService,
    private organisationService: OrganisationService,
    private patronTransactionService: PatronTransactionService,
    private modalService: BsModalService,
    private userService: UserService
  ) {}

  /** OnInit hook */
  ngOnInit() {
    this.patronService.currentPatron$.subscribe((patron: any) => {
      if (patron) {
        this.patron = patron;
        // engaged fees
        this.subscriptions.add(
          this.patronTransactionService
            .patronTransactionsSubject$
            .subscribe((transactions) => {
              this.tabs.engagedFees.transactions = transactions;
              this.tabs.engagedFees.totalAmount = this.patronTransactionService.computeTotalTransactionsAmount(transactions);
            }
          )
        );
        // overdue fees
        this.patronService
          .getOverduesPreview(this.patron.pid)
          .subscribe((overdues) => {
            this.tabs.overduePreviewFees.transactions = overdues;
            this.tabs.overduePreviewFees.totalAmount = overdues.reduce((acc, overdue) => acc + overdue.fees.total, 0);
          });
        this.reloadEngagedFees();
      }
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS ==================================================================
  /** load all PatronTransactions for the patron without 'status' restriction */
  loadFeesHistory() {
    if (this.patron && this.tabs.historyFees.transactions === null) {
      this.patronTransactionService
        .patronTransactionsByPatron$(this.patron.pid, undefined, PatronTransactionStatus.CLOSED.toString())
        .subscribe(transactions => {
          this.tabs.historyFees.transactions = transactions;
        });
    }
  }

  /** Allow to pay the total of each pending patron transactions */
  payAllTransactions() {
    const initialState = {
      action: 'pay',
      mode: 'full',
      transactions: this.tabs.engagedFees.transactions
    };
    this.modalService.show(PatronTransactionEventFormComponent, {initialState});
  }

  /** Allow to pay the total of each pending patron transactions */
  payAllTransactionsInMyLibrary() {
    const initialState = {
      action: 'pay',
      mode: 'full',
      transactions: this.myLibraryEngagedFees
    };
    this.modalService.show(PatronTransactionEventFormComponent, {initialState});
  }

  /**
   * Event handler when user click on a 'vertical tab'.
   * All other tabs will be hidden.
   * @param tabToOpen: the tab to open
   */
  openTab(tabToOpen): void {
    for (const entry of Object.values(this.tabs)) {
      entry.isOpen = tabToOpen === entry;
    }
  }

  /** Opening a modal to manually add a fee. */
  addFee(): void {
    this.modalRef = this.modalService.show(PatronFeeComponent, {
        ignoreBackdropClick: true,
        initialState: {
          patronPid: this.patron.pid,
          organisationPid: this.patron.organisation.pid
        }
      }
    );
    this.subscriptions.add(
      this.modalRef.content.onSubmit
        .pipe(first())
        .subscribe(() => this.reloadEngagedFees())
    );
  }

  // PRIVATE COMPONENTS FUNCTIONS =============================================
  /** Notify than engaged fees for the current patron should be reloaded. */
  private reloadEngagedFees(): void {
    this.patronTransactionService.emitPatronTransactionByPatron(this.patron.pid, undefined, 'open');
  }
}
