// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PatronTransaction, PatronTransactionEvent } from '../../../classes/patron-transaction';
import { PatronNamePipe } from '../../../pipe/patron-name.pipe';

@Component({
  selector: 'admin-patron-transaction-event-default',
  templateUrl: './patron-transaction-event-default.component.html',
  imports: [RouterLink, AsyncPipe, TranslatePipe, PatronNamePipe],
})
export class PatronTransactionEventDefaultComponent {
  event = input<PatronTransactionEvent>();
  parent = input<PatronTransaction>();
}
