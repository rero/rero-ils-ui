// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { OrderLineComponent } from '../order-line/order-line.component';
import { OrderDetailStore } from '../store/order-detail.store';

@Component({
    selector: 'admin-order-lines',
    templateUrl: './order-lines.component.html',
    imports: [OrderLineComponent, TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderLinesComponent {

  protected readonly store = inject(OrderDetailStore);
  protected readonly order = this.store.order;
  protected readonly orderLines = this.store.orderLines;
}
