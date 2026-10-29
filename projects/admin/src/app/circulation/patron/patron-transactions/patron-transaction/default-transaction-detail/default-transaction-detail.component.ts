// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PatronTransaction } from '../../../../../classes/patron-transaction';

@Component({
  selector: 'admin-default-transaction-detail',
  templateUrl: './default-transaction-detail.component.html',
  imports: [TranslatePipe],
})
export class DefaultTransactionDetailComponent {
  /** Patron transaction */
  transaction = input<PatronTransaction>();
}
