/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { AppStore } from '@rero/shared';
import { AcqBudgetApiService } from '../../../api/acq-budget-api.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'admin-budget-detail-view',
    templateUrl: './budget-detail-view.component.html',
    imports: [TranslateDirective, CurrencyPipe, TranslatePipe, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetDetailViewComponent {

  private budgetApiService: AcqBudgetApiService = inject(AcqBudgetApiService);
  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** Record data */
  readonly record = input<any>();
  /** Record type */
  readonly type = input<string>('');

  /** Budget total allocated amount */
  readonly totalAmount = toSignal(
    toObservable(this.record).pipe(
      filter((record: any) => !!record?.metadata?.pid),
      switchMap((record: any) => this.budgetApiService.getBudgetTotalAmount(record.metadata.pid))
    ),
    { initialValue: 0 }
  );

  // GETTER & SETTER ==========================================================
  /** Get the currency code used for the current loaded organisation */
  get currencyCode(): string | undefined {
    return this.appStore.organisation()?.default_currency;
  }
}
