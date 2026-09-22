// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentRecord } from '@app/admin/circulation/model/circulation.model';
import { TranslateDirective } from '@ngx-translate/core';
import { ContributionComponent } from '@rero/shared';

@Component({
  selector: 'admin-transaction-history-document',
  imports: [RouterLink, ContributionComponent, TranslateDirective],
  templateUrl: './transaction-history-document.component.html',
})
export class TransactionHistoryDocumentComponent {

  documentPid = input.required<string>();
  documentTitle = input.required<string>();
  document = input<DocumentRecord | undefined>(undefined);
  documentNotFound = input(false);

  /** Emitted when the user clicks the document link, so the dialog should close. */
  closeRequested = output<void>();
}
