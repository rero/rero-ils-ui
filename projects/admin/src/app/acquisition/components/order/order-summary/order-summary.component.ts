// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

import { AcqOrderStatus } from '../../../classes/order';
import { OrderDetailStore } from '../order-detail-view/store/order-detail.store';

@Component({
  selector: 'admin-order-summary',
  templateUrl: './order-summary.component.html',
  imports: [
    RouterLink,
    Bind,
    Tag,
    NgTemplateOutlet,
    AsyncPipe,
    CurrencyPipe,
    DateTranslatePipe,
    GetRecordPipe,
    TranslatePipe,
  ],
})
export class OrderSummaryComponent {
  protected readonly store = inject(OrderDetailStore);
  protected readonly order = this.store.order;

  acqOrderStatus = AcqOrderStatus;
}
