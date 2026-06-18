// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransactionEventDefaultComponent } from './patron-transaction-event-default.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { InheritedCallNumberComponent, MainTitlePipe } from '@rero/shared';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PatronNamePipe } from '../../../pipe/patron-name.pipe';

@Component({
    selector: 'admin-patron-transaction-event-overdue',
    templateUrl: './patron-transaction-event-overdue.component.html',
    imports: [TranslateDirective, InheritedCallNumberComponent, RouterLink, AsyncPipe, TranslatePipe, MainTitlePipe, PatronNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionEventOverdueComponent extends PatronTransactionEventDefaultComponent {

}
