/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
