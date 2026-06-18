// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy, effect, signal} from '@angular/core';
import { PaymentData, SubtypeBucket } from './interfaces';
import { RecordSearchComponent, RecordSearchPageComponent, RecordSearchStore } from '@rero/ng-core';
import { PaymentsDataComponent } from './payments-data/payments-data.component';

@Component({
    selector: 'admin-patron-transaction-event-search-view',
    templateUrl: './patron-transaction-event-search-view.component.html',
    imports: [PaymentsDataComponent, RecordSearchComponent],
    providers: [RecordSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionEventSearchViewComponent extends RecordSearchPageComponent {
  private initialData: PaymentData = { total: 0, subtypes: [] };
  protected paymentData = signal(this.initialData);

  constructor() {
    super();
    effect(() => {
      const aggTotal = this.store.aggregations().find(agg => agg.key === 'total' && 'loaded' in agg) as any;
      if (aggTotal && 'payment' in aggTotal) {
        const subtypesTotal = aggTotal.subtype.buckets.map((b: SubtypeBucket) => ({
          name: b.key,
          total: b.subtotal.value
        }));
        this.paymentData.set({ total: +aggTotal.payment.value, subtypes: subtypesTotal });
      }
    });
  }
}
