// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcqOrderStatus } from '../../../classes/order';
import { OrderDetailStore } from '../order-detail-view/store/order-detail.store';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { NgTemplateOutlet, AsyncPipe, CurrencyPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-order-summary',
    templateUrl: './order-summary.component.html',
    imports: [TranslateDirective, RouterLink, Bind, Tag, NgTemplateOutlet, AsyncPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryComponent {

  protected readonly store = inject(OrderDetailStore);
  protected readonly order = this.store.order;

  acqOrderStatus = AcqOrderStatus;
}
