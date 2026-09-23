// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibraryRecord, PatronRecord, TransactionLoan, TransactionScan } from '@app/admin/circulation/model/circulation.model';
import { Item } from '@app/admin/classes/items';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'admin-transaction-history-actor',
  imports: [CurrencyPipe, DateTranslatePipe, I18nPluralPipe, RouterLink, Tag, TranslateDirective, TranslatePipe],
  templateUrl: './transaction-history-actor.component.html',
})
export class TransactionHistoryActorComponent {

  /** `loan` part of the operation_logs entry — `undefined` for a scan_item entry. */
  loan = input<TransactionLoan | undefined>(undefined);
  /** `scan` part of the operation_logs entry — `undefined` for a loan entry. */
  scan = input<TransactionScan | undefined>(undefined);
  /** Up-to-date patron record, fetched from the API (for its barcode). */
  patron = input<PatronRecord | undefined>(undefined);
  /** Library that performed the scan, fetched from the API (for its name). */
  library = input<LibraryRecord | undefined>(undefined);
  /** Whether the library record failed to load (404/403), as opposed to still loading. */
  libraryNotFound = input(false);
  /** Currently attached loan (up-to-date state/end_date), from the full item. */
  currentFullItem = input.required<Item | undefined>();
  /** Total amount of open overdue fees for the currently attached loan. */
  totalAmountOfFee = input(0);
  /** Organisation default currency, for the fees badge. */
  organisationCurrency = input<string | undefined>(undefined);

  /** Emitted when the user clicks the patron link, so the dialog should close. */
  closeRequested = output<void>();
}
