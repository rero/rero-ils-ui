// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageModule } from '@openng/optimus-ui/message';
import { AppStore } from '@rero/shared';
import { filter, switchMap } from 'rxjs';

import { AcqBudgetApiService } from '../../../api/acq-budget-api.service';

@Component({
  selector: 'admin-budget-detail-view',
  templateUrl: './budget-detail-view.component.html',
  imports: [CurrencyPipe, TranslatePipe, MessageModule],
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
      switchMap((record: any) => this.budgetApiService.getBudgetTotalAmount(record.metadata.pid)),
    ),
    { initialValue: 0 },
  );

  // GETTER & SETTER ==========================================================
  /** Get the currency code used for the current loaded organisation */
  get currencyCode(): string | undefined {
    return this.appStore.organisation()?.default_currency;
  }
}
