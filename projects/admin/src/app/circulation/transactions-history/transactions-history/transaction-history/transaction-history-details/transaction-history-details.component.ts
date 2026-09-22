// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransactionLoan, TransactionScan } from '@app/admin/circulation/model/circulation.model';
import { Item } from '@app/admin/classes/items';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe, UpperCaseFirstPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-transaction-history-details',
  imports: [AsyncPipe, GetRecordPipe, TranslateDirective, UpperCaseFirstPipe, TranslatePipe],
  templateUrl: './transaction-history-details.component.html',
})
export class TransactionHistoryDetailsComponent {

  /** Full item (with location, temporary_location, collections, ...), fetched from the API. */
  fullItem = input<Item | undefined>(undefined);
  /** `loan` part of the operation_logs entry — `undefined` for a scan_item entry. */
  loan = input<TransactionLoan | undefined>(undefined);
  /** `scan` part of the operation_logs entry — `undefined` for a loan entry. */
  scan = input<TransactionScan | undefined>(undefined);
}
