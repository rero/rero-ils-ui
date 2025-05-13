/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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

import { Component, computed, inject, model, ModelSignal, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Loan, LoanOverduePreview } from '@app/admin/classes/loans';
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { CirculationStatsService } from '../service/circulation-stats.service';
import { PatronFeeComponent } from './patron-fee/patron-fee.component';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';
import { PatronService } from '@app/admin/service/patron.service';

@Component({
    selector: 'admin-patron-transactions',
    templateUrl: './patron-transactions.component.html',
    standalone: false
})
export class PatronTransactionsComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);
  private patronService: PatronService = inject(PatronService);

  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  private dynamicDialogRef: DynamicDialogRef | undefined;

  activePanel: ModelSignal<undefined | string> = model<undefined | string>(undefined);

  statistics = this.circulationStatsService.statistics;

  // COMPONENTS ATTRIBUTES ===============================================================
  /** all tab reference array */
  tabs = {
    engagedFees: {
      transactions: null as WritableSignal<PatronTransaction[]>,
    },
    overduePreviewFees: {
      transactions: null as  WritableSignal<{fees: LoanOverduePreview, loan: Loan}[]>,
    },
    historyFees: {
      transactions: null as PatronTransaction[]
    }
  };

  actions = computed<MenuItem[] | undefined>(() => {
    return [
      {
        label: this.translateService.instant('for my library'),
        command: () => this.payAllTransactionsInMyLibrary(),
        disabled: this.myLibraryEngagedFees().length === 0
      }
    ];
  });

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
  myLibraryEngagedFees = computed<PatronTransaction[]>(() => {
    const libraryPID = this.userService.user.currentLibrary;
    return this.tabs.engagedFees.transactions().filter(t => t.library != null && t.library.pid === libraryPID);
  });

  // CONSTRUCTOR & HOOKS ==================================================================
  /** OnInit hook */
  ngOnInit(): void {
    this.activePanel.set("0");
    this.tabs.overduePreviewFees.transactions = this.circulationStatsService.overdueTransactions;
    this.tabs.engagedFees.transactions = this.circulationStatsService.engagedTransactions;
    this.patronService.currentPatron$.subscribe(patron => this.patron = patron);
    this.subscriptions.add(
      this.activePanel. subscribe(val => {
        // lazy loading history
        if (val === "2") {
          this.loadFeesHistory();
        }
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS ==================================================================
  /** load all PatronTransactions for the patron without 'status' restriction */
  loadFeesHistory(): void {
    if (this.patron) {
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
      modal: true,
      focusOnShow: false,
      width: '50vw',
      closable: true,
      data: {
        action: 'pay',
        mode: 'full',
        transactions: this.tabs.engagedFees.transactions()
      }
    });
  }

  /** Allow to pay the total of each pending patron transactions */
  payAllTransactionsInMyLibrary(): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      header: this.translateService.instant('Pay for my library'),
      modal: true,
      focusOnShow: false,
      width: '50vw',
      closable: true,
      data: {
        action: 'pay',
        mode: 'full',
        transactions: this.myLibraryEngagedFees()
      }
    });
  }

  /** Opening a modal to manually add a fee. */
  addFee(): void {
    this.dynamicDialogRef = this.dialogService.open(PatronFeeComponent, {
      header: this.translateService.instant('New fee'),
      modal: true,
      focusOnShow: false,
      width: '30vw',
      closable: true,
      data: {
        patron: this.patron,
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
