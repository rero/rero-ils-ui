/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2022 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component, computed, inject, input, OnInit, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';

import { PatronTransaction, PatronTransactionEvent, PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { AppStore } from '@rero/shared';

import { PatronTransactionsService } from '../../../service/patron-transactions.service';
import { PatronTransactionEventOverdueComponent } from './patron-transaction-event-overdue.component';
import { PatronTransactionEventDefaultComponent } from './patron-transaction-event-default.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-patron-transaction-events-brief-view',
    templateUrl: './patron-transaction-events-brief-view.component.html',
    imports: [PatronTransactionEventOverdueComponent, PatronTransactionEventDefaultComponent, Bind, Tag, CurrencyPipe, DatePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionEventsBriefViewComponent implements OnInit {

  private appStore = inject(AppStore);
  private patronTransactionService: PatronTransactionsService = inject(PatronTransactionsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Information to build the URL on the record detail view. */
  detailUrl = input<{ link: string; external: boolean }>();
  /** The record to perform. */
  record = input<any>();
  /** The type of the record. */
  type = input<string>();

  /** is all data are loaded */
  loaded = signal(false);
  /** transaction object representation from record */
  event: WritableSignal<PatronTransactionEvent> = signal(null);
  /** Parent parent transaction */
  parent: PatronTransaction;
  /** current organisation */
  readonly organisation = computed(() => this.appStore.organisation());
  /** reference to PatronTransactionEventType */
  eventTypes = PatronTransactionEventType;
  severity = computed(() => {
    switch(this.event().type) {
      case 'fee':
        return 'danger';
      case 'payment':
        return 'success';
      case 'dispute':
        return 'warn';
      default:
        return 'secondary';
    }
  });

  /** OnInit hook */
  ngOnInit(): void {
    this.event.set(new PatronTransactionEvent(this.record().metadata));
    this.patronTransactionService
      .getPatronTransaction(this.event().parent.pid)
      .subscribe((parent: PatronTransaction) => {
        this.parent = parent;
        this.loaded.set(true);
      });
  }

}
