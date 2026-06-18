// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransaction, PatronTransactionEvent } from '../../../classes/patron-transaction';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PatronNamePipe } from '../../../pipe/patron-name.pipe';

@Component({
    selector: 'admin-patron-transaction-event-default',
    templateUrl: './patron-transaction-event-default.component.html',
    imports: [TranslateDirective, RouterLink, AsyncPipe, TranslatePipe, PatronNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionEventDefaultComponent {

  event = input<PatronTransactionEvent>();
  parent = input<PatronTransaction>();

}
