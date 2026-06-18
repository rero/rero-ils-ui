// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransaction } from '../../../../../classes/patron-transaction';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'admin-default-transaction-detail',
    templateUrl: './default-transaction-detail.component.html',
    imports: [TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultTransactionDetailComponent {

  /** Patron transaction */
  transaction = input<PatronTransaction>();

}
