// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { I18nPluralPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { TransactionRecord } from '@app/admin/circulation/model/circulation.model';
import { transactionsHistoryStore } from '@app/admin/circulation/store/transactions-history.store';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, UpperCaseFirstPipe } from '@rero/ng-core';
import { PaginatorComponent } from '@rero/shared';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

@Component({
  selector: 'admin-transactions-history',
  imports: [
    DateTranslatePipe,
    I18nPluralPipe,
    KeyValuePipe,
    PaginatorComponent,
    TransactionHistoryComponent,
    TranslatePipe,
    UpperCaseFirstPipe
  ],
  templateUrl: './transactions-history.component.html',
  providers: [transactionsHistoryStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsHistoryComponent {

  protected store = inject(transactionsHistoryStore);

  /** Emitted when the user clicks a link that navigates away, so the dialog should close. */
  closeRequested = output<void>();

  /** Sort date groups in descending order (most recent date first). */
  protected sortByDateDesc = (a: KeyValue<string, TransactionRecord[]>, b: KeyValue<string, TransactionRecord[]>): number => {
    return b.key.localeCompare(a.key);
  };
}
