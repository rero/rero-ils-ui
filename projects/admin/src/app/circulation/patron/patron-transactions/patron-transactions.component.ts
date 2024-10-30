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

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Loan, LoanOverduePreview } from '@app/admin/classes/loans';
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronService } from '@app/admin/service/patron.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabViewChangeEvent } from 'primeng/tabview';
import { Subscription } from 'rxjs';
import { CirculationService } from '../../services/circulation.service';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { PatronFeeComponent } from './patron-fee/patron-fee.component';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';

@Component({
  selector: 'admin-patron-transactions',
  templateUrl: './patron-transactions.component.html',
  styleUrls: ['./patron-transactions.component.scss']
})
export class PatronTransactionsComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private patronService: PatronService = inject(PatronService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);
  private circulationService: CirculationService = inject(CirculationService);

  private dynamicDialogRef: DynamicDialogRef | undefined;

  // COMPONENTS ATTRIBUTES ===============================================================
  /** all tab reference array */
  tabs = {
    engagedFees: {
      transactions: [] as PatronTransaction[],
      totalAmount: 0
    },
    overduePreviewFees: {
      transactions: [] as {fees: LoanOverduePreview, loan: Loan}[],
      totalAmount: 0
    },
    historyFees: {
      transactions: null as PatronTransaction[]
    }
  };

  actions: MenuItem[] | undefined;

  /** Current patron */
  private patron: any = undefined;
  /** Component subscriptions */
  private subscriptions = new Subscription();


  // GETTER & SETTER ======================================================================
  /**
   * Get current organisation
   * @return current organisation
   */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /**
   * Get engaged fees related to the current user library
   * @return the list of corresponding transactions.
   */
  get myLibraryEngagedFees(): PatronTransaction[] {
    const libraryPID = this.userService.user.currentLibrary;
    return this.tabs.engagedFees.transactions.filter(t => t.library != null && t.library.pid === libraryPID);
  }

  get statistics() {
    return this.circulationService.statistics;
  }

  // CONSTRUCTOR & HOOKS ==================================================================
  /** OnInit hook */
  ngOnInit(): void {
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
              this.generateActionsMenu();
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
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  generateActionsMenu(): void {
    this.actions = [
      {
        label: this.translateService.instant('for my library'),
        command: () => this.payAllTransactionsInMyLibrary(),
        disabled: this.myLibraryEngagedFees.length === 0
      }
    ];
  }

  tabChange(event: TabViewChangeEvent) {
    if (event.index !== 0) {
      this.loadFeesHistory();
    }
  }

  // COMPONENT FUNCTIONS ==================================================================
  /** load all PatronTransactions for the patron without 'status' restriction */
  loadFeesHistory(): void {
    if (this.patron && this.tabs.historyFees.transactions === null) {
      this.patronTransactionService
        .patronTransactionsByPatron$(this.patron.pid, undefined, PatronTransactionStatus.CLOSED.toString())
        .subscribe(transactions => {
          this.tabs.historyFees.transactions = transactions;
        });
    }
  }

  /** Allow to pay the total of each pending patron transactions */
  payAllTransactions(): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      header: this.translateService.instant('Pay'),
      width: '50vw',
      data: {
        action: 'pay',
        mode: 'full',
        transactions: this.tabs.engagedFees.transactions
      }
    });
  }

  /** Allow to pay the total of each pending patron transactions */
  payAllTransactionsInMyLibrary(): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      header: this.translateService.instant('Pay for my library'),
      width: '50vw',
      data: {
        action: 'pay',
        mode: 'full',
        transactions: this.myLibraryEngagedFees
      }
    });
  }

  /** Opening a modal to manually add a fee. */
  addFee(): void {
    this.dynamicDialogRef = this.dialogService.open(PatronFeeComponent, {
      header: this.translateService.instant('New fee'),
      width: '30vw',
      data: {
        patronPid: this.patron.pid,
        organisationPid: this.patron.organisation.pid
      }
    });
    this.subscriptions.add(
      this.dynamicDialogRef.onClose.subscribe(() => this.reloadEngagedFees())
    );
  }

  // PRIVATE COMPONENTS FUNCTIONS =============================================
  /** Notify than engaged fees for the current patron should be reloaded. */
  private reloadEngagedFees(): void {
    this.patronTransactionService.emitPatronTransactionByPatron(this.patron.pid, undefined, 'open');
  }
}
