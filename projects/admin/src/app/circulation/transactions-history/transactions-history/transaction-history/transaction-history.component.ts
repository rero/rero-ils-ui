// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  DocumentRecord,
  isLoanMetadata,
  isScanItemMetadata,
  ItemRecord,
  LibraryRecord,
  PatronRecord,
  TransactionRecord,
} from '@app/admin/circulation/model/circulation.model';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { computeTotalTransactionsAmount } from '@app/admin/circulation/utils/transaction.utils';
import { Item } from '@app/admin/classes/items';
import { ItemsService } from '@app/admin/service/items.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, RecordService } from '@rero/ng-core';
import { AppStore, OpenCloseButtonComponent } from '@rero/shared';
import { Button } from 'primeng/button';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TransactionStatusPipe } from '../transaction-status.pipe';
import { TransactionHistoryActorComponent } from './transaction-history-actor/transaction-history-actor.component';
import { TransactionHistoryDetailsComponent } from './transaction-history-details/transaction-history-details.component';
import { TransactionHistoryDocumentComponent } from './transaction-history-document/transaction-history-document.component';

@Component({
  selector: 'admin-transaction-history',
  imports: [
    Button,
    DateTranslatePipe,
    OpenCloseButtonComponent,
    JsonPipe,
    RouterLink,
    ScrollPanel,
    Skeleton,
    Tag,
    TransactionHistoryActorComponent,
    TransactionHistoryDetailsComponent,
    TransactionHistoryDocumentComponent,
    TransactionStatusPipe,
    TranslateDirective,
    TranslatePipe,
  ],
  templateUrl: './transaction-history.component.html',
})
export class TransactionHistoryComponent {

  private recordService = inject(RecordService);
  private itemsService = inject(ItemsService);
  private patronTransactionService = inject(PatronTransactionService);
  private appStore = inject(AppStore);

  transaction = input.required<TransactionRecord>();

  /** Emitted when the user clicks a link that navigates away, so the dialog should close. */
  closeRequested = output<void>();

  /** Whether the row details (location, notes) are collapsed */
  protected isCollapsed = signal(true);

  debugMode = signal(false);

  get canUseDebugMode(): boolean {
    return this.appStore.canAccessDebugMode();
  }

  /** Whether this entry is a loan (checkout/checkin/renewal/request/...) rather than a scan_item. */
  protected isLoan = computed(() => isLoanMetadata(this.transaction().metadata));

  /** The `loan` part of the operation_logs entry, or `undefined` for a scan_item entry. */
  protected logLoan = computed(() => {
    const {metadata} = this.transaction();
    return isLoanMetadata(metadata) ? metadata.loan : undefined;
  });

  /** The `scan` part of the operation_logs entry, or `undefined` for a loan entry. */
  protected logScan = computed(() => {
    const {metadata} = this.transaction();
    return isScanItemMetadata(metadata) ? metadata.scan : undefined;
  });

  /** Pid of the item involved in this entry, whether it's a loan or a scan_item. */
  private itemPid = computed(() => {
    const {metadata} = this.transaction();
    return isLoanMetadata(metadata) ? metadata.loan.item.pid : metadata.scan.item.pid;
  });

  /** Pid of the document involved in this entry, whether it's a loan or a scan_item. */
  protected documentPid = computed(() => {
    const {metadata} = this.transaction();
    return isLoanMetadata(metadata) ? metadata.loan.item.document.pid : metadata.scan.item.document.pid;
  });

  /** Document title, as captured in the operation_logs entry. */
  protected documentTitle = computed(() => {
    const {metadata} = this.transaction();
    return isLoanMetadata(metadata) ? metadata.loan.item.document.title : metadata.scan.item.document.title;
  });

  /**
   * Up-to-date item (barcode, call_number, ...), fetched from the ES-backed
   * `items` resource — not organisation-restricted, so this should always
   * resolve. Caught nonetheless, in case the item was since deleted.
   */
  private itemResource = toSignal(
    toObservable(this.itemPid).pipe(
      switchMap((itemPid) => this.recordService.getRecord<ItemRecord>('items', itemPid).pipe(
        map((value) => ({ value, notFound: false })),
        catchError(() => of({ value: undefined, notFound: true }))
      ))
    ),
    { initialValue: { value: undefined, notFound: false } }
  );

  protected item = computed(() => this.itemResource().value);
  protected itemNotFound = computed(() => this.itemResource().notFound);

  /**
   * Full item (with its currently attached loan, when this entry is a loan),
   * fetched the same way the rest of circulation does it: via the item's
   * barcode (`ItemsService.getItem`), which embeds the loan — not via
   * `loans/<pid>` directly, which is access-protected (403). That
   * barcode-based endpoint is itself restricted to the current organisation:
   * for an item belonging to another organisation, it also returns a 403.
   * In that case, `fullItem` stays `undefined` and the template falls back
   * to `transaction().metadata.loan`, which already carries the state
   * captured in the operation_logs entry at the time of the transaction.
   */
  protected fullItem = toSignal<Item | undefined>(
    toObservable(this.item).pipe(
      switchMap((item) => {
        if (!item?.metadata.barcode) {
          return of(undefined);
        }
        return this.itemsService.getItem(item.metadata.barcode).pipe(
          catchError(() => of(undefined))
        );
      })
    ),
    { initialValue: undefined }
  );

  /**
   * Total amount of open overdue fees for the loan involved in this log
   * entry, fetched the same way `item.component.ts` does it
   * (patron-transactions of type 'overdue' and status 'open'). Always 0 for
   * a scan_item entry, which has no loan.
   *
   * Uses `metadata.loan.pid` (the loan captured in this specific log entry)
   * rather than `fullItem().loan?.pid` (the item's currently attached loan):
   * once this loan is closed by a later checkin, the item no longer has it
   * attached, and `fullItem().loan` becomes `undefined` — which would wrongly
   * make the fees for this entry disappear.
   */
  protected totalAmountOfFee = toSignal(
    toObservable(this.logLoan).pipe(
      switchMap((loan) => {
        if (!loan?.pid) {
          return of(0);
        }
        return this.patronTransactionService.patronTransactionsByLoan(loan.pid, 'overdue', 'open').pipe(
          switchMap((transactions) => of(computeTotalTransactionsAmount(transactions))),
          catchError(() => of(0))
        );
      })
    ),
    { initialValue: 0 }
  );

  protected organisationCurrency = computed(() => this.appStore.organisation()?.default_currency);

  /**
   * Document involved in this entry, fetched from the API to get its authors
   * (contribution), which are not part of the operation_logs entry.
   * `resolve: 1` is required to resolve the `$ref` entity links (agents)
   * embedded in `contribution` into actual objects with a `type` — without
   * it, `ContributionComponent`'s type filter matches nothing.
   */
  private documentResource = toSignal(
    toObservable(this.documentPid).pipe(
      switchMap((documentPid) =>
        this.recordService.getRecord<DocumentRecord>('documents', documentPid, { resolve: 1 }).pipe(
          map((value) => ({ value, notFound: false })),
          catchError(() => of({ value: undefined, notFound: true }))
        )
      )
    ),
    { initialValue: { value: undefined, notFound: false } }
  );

  protected document = computed(() => this.documentResource().value);
  protected documentNotFound = computed(() => this.documentResource().notFound);

  /**
   * Up-to-date patron, fetched from the API to get its barcode — used to
   * build the '/circulation/patron/{barcode}/loan' link. The barcode is not
   * part of the operation_logs entry (`transaction().metadata.loan.patron`
   * only carries pid and name). Only relevant for a loan entry — a
   * scan_item entry has no patron, only a library (see `library` below).
   */
  private patronResource = toSignal(
    toObservable(this.transaction).pipe(
      switchMap((transaction) => {
        const {metadata} = transaction;
        if (!isLoanMetadata(metadata)) {
          return of({ value: undefined, notFound: false });
        }
        return this.recordService.getRecord<PatronRecord>('patrons', metadata.loan.patron.pid).pipe(
          map((value) => ({ value, notFound: false })),
          catchError(() => of({ value: undefined, notFound: true }))
        );
      })
    ),
    { initialValue: { value: undefined, notFound: false } }
  );

  protected patron = computed(() => this.patronResource().value);
  protected patronNotFound = computed(() => this.patronResource().notFound);

  /**
   * Library that performed the scan, fetched from the API to get its name
   * — `transaction().metadata.library` only carries a pid. Only relevant
   * for a scan_item entry, which has no patron.
   */
  private libraryResource = toSignal(
    toObservable(this.transaction).pipe(
      switchMap((transaction) => {
        const {metadata} = transaction;
        if (!isScanItemMetadata(metadata)) {
          return of({ value: undefined, notFound: false });
        }
        return this.recordService.getRecord<LibraryRecord>('libraries', metadata.library.value).pipe(
          map((value) => ({ value, notFound: false })),
          catchError(() => of({ value: undefined, notFound: true }))
        );
      })
    ),
    { initialValue: { value: undefined, notFound: false } }
  );

  protected library = computed(() => this.libraryResource().value);
  protected libraryNotFound = computed(() => this.libraryResource().notFound);

  protected toggleRow(collapsed: boolean): void {
    this.isCollapsed.set(collapsed);
    if (this.debugMode()) {
      this.debugMode.update((flag) => !flag);
    }
  }
}
