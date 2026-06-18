// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, inject, model, ModelSignal, Signal, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { CirculationStore } from '../../store/circulation.store';
import { PatronFeeComponent } from './patron-fee/patron-fee.component';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';
import { Bind } from 'primeng/bind';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { PatronTransactionComponent } from './patron-transaction/patron-transaction.component';
import { OverdueTransactionComponent } from './overdue-transaction/overdue-transaction.component';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'admin-patron-transactions',
    templateUrl: './patron-transactions.component.html',
    imports: [Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, TranslateDirective, Tag, AccordionContent, Button, SplitButton, PatronTransactionComponent, OverdueTransactionComponent, CurrencyPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionsComponent {

  private dialogService: DialogService = inject(DialogService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private appStore = inject(AppStore);
  private translateService: TranslateService = inject(TranslateService);
  protected store = inject(CirculationStore);

  private dynamicDialogRef: DynamicDialogRef | undefined;

  activePanel: ModelSignal<undefined | string> = model<undefined | string>(undefined);

  readonly statistics = this.store.statistics;

  tabs = {
    engagedFees: {
      transactions: this.store.openTransactions as Signal<PatronTransaction[]>,
    },
    overduePreviewFees: {
      transactions: this.store.overdueTransactions,
    },
    historyFees: {
      transactions: signal<PatronTransaction[]>([])
    }
  };

  actions = computed<MenuItem[] | undefined>(() => [
    {
      label: this.translateService.instant('for my library'),
      command: () => this.payAllTransactionsInMyLibrary(),
      disabled: this.myLibraryEngagedFees().length === 0
    }
  ]);

  myLibraryEngagedFees = computed<PatronTransaction[]>(() => {
    const libraryPID = this.appStore.currentLibraryPid();
    return this.store.openTransactions().filter(t => t.library != null && t.library.pid === libraryPID);
  });

  constructor() {
    this.activePanel.set("0");
    toObservable(this.activePanel).pipe(takeUntilDestroyed()).subscribe(val => {
      if (val === "2") {
        this.loadFeesHistory();
      }
    });
  }

  get organisation(): any {
    return this.appStore.organisation();
  }

  loadFeesHistory(): void {
    const pid = this.store.patron()?.pid;
    if (!pid) return;
    this.patronTransactionService
      .patronTransactionsByPatron(pid, undefined, PatronTransactionStatus.CLOSED.toString())
      .subscribe(transactions => this.tabs.historyFees.transactions.set(transactions));
  }

  payAllTransactions(): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      header: this.translateService.instant('Pay'),
      modal: true,
      focusOnShow: false,
      width: '50vw',
      closable: true,
      data: { action: 'pay', mode: 'full', transactions: this.store.openTransactions() }
    })?.onClose.subscribe((pid: string | undefined) => {
      if (pid) this.store.reloadOpenTransactions(pid);
    });
  }

  payAllTransactionsInMyLibrary(): void {
    this.dialogService.open(PatronTransactionEventFormComponent, {
      header: this.translateService.instant('Pay for my library'),
      modal: true,
      focusOnShow: false,
      width: '50vw',
      closable: true,
      data: { action: 'pay', mode: 'full', transactions: this.myLibraryEngagedFees() }
    })?.onClose.subscribe((pid: string | undefined) => {
      if (pid) this.store.reloadOpenTransactions(pid);
    });
  }

  addFee(): void {
    const patron = this.store.patron() as any;
    if (!patron) return;
    this.dynamicDialogRef = this.dialogService.open(PatronFeeComponent, {
      header: this.translateService.instant('New fee'),
      modal: true,
      focusOnShow: false,
      width: '30vw',
      closable: true,
      data: { patron, organisationPid: patron.organisation?.pid }
    });
    this.dynamicDialogRef.onClose.subscribe(() => {
      const pid = this.store.patron()?.pid;
      if (pid) {
        this.store.reloadOpenTransactions(pid);
        this.store.loadStats(pid);
      }
    });
  }
}
