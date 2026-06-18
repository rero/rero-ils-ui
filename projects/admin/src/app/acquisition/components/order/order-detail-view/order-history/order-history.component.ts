// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Timeline } from 'primeng/timeline';
import { OrderDetailStore } from '../store/order-detail.store';

@Component({
  selector: 'admin-order-history',
  templateUrl: './order-history.component.html',
  imports: [Timeline, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
  protected readonly store = inject(OrderDetailStore);
  protected readonly versions = this.store.historyVersions;
}
