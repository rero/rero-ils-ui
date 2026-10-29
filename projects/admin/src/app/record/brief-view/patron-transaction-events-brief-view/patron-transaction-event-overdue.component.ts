// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InheritedCallNumberComponent, MainTitlePipe } from '@rero/shared';

import { PatronNamePipe } from '../../../pipe/patron-name.pipe';
import { PatronTransactionEventDefaultComponent } from './patron-transaction-event-default.component';

@Component({
  selector: 'admin-patron-transaction-event-overdue',
  templateUrl: './patron-transaction-event-overdue.component.html',
  imports: [InheritedCallNumberComponent, RouterLink, AsyncPipe, TranslatePipe, MainTitlePipe, PatronNamePipe],
})
export class PatronTransactionEventOverdueComponent extends PatronTransactionEventDefaultComponent {}
