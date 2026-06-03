/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Item } from '@app/admin/classes/items';
import { Loan, LoanOverduePreview } from '@app/admin/classes/loans';
import { PatronTransactionEvent, PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { TranslateDirective } from '@ngx-translate/core';
import { DateTranslatePipe, GetRecordPipe, RecordService, TruncateTextPipe } from '@rero/ng-core';
import { AppStore, InheritedCallNumberComponent, MainTitlePipe, OpenCloseButtonComponent } from '@rero/shared';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PatronTransactionHistoryComponent } from '../patron-transaction/patron-transaction-history/patron-transaction-history.component';

@Component({
  selector: 'admin-overdue-transaction',
  templateUrl: './overdue-transaction.component.html',
  imports: [OpenCloseButtonComponent, RouterLink, TranslateDirective, InheritedCallNumberComponent, PatronTransactionHistoryComponent, AsyncPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, MainTitlePipe, TruncateTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverdueTransactionComponent {

  private appStore = inject(AppStore);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES ====================================================
  transaction = input<{loan: Loan, fees: LoanOverduePreview}>();
  isCollapsed = signal(true);

  private readonly loanData = toSignal(
    toObservable(this.transaction).pipe(
      switchMap(t => {
        if (!t) return of(null);
        t.fees.steps = t.fees.steps.map(event => new PatronTransactionEvent({
          creation_date: event[1],
          amount: event[0],
          type: PatronTransactionEventType.FEE,
          subtype: 'overdue'
        })).reverse();
        if (!t.loan.item_pid?.value || !t.loan.document_pid) return of(null);
        return forkJoin([
          this.recordService.getRecord('items', t.loan.item_pid.value),
          this.recordService.getRecord('documents', t.loan.document_pid)
        ]).pipe(
          map(([itemData, documentData]: [any, any]) => ({
            item: new Item(itemData.metadata),
            document: documentData.metadata
          }))
        );
      })
    ),
    { initialValue: null }
  );

  readonly item = computed(() => this.loanData()?.item ?? null);
  readonly document = computed(() => this.loanData()?.document ?? null);

  get organisation() {
    return this.appStore.organisation();
  }
}
