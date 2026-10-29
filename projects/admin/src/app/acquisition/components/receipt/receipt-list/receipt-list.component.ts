// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Badge } from '@openng/optimus-ui/badge';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Panel } from '@openng/optimus-ui/panel';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { Nl2brPipe } from '@rero/ng-core';

import { OrderDetailStore } from '../../order/order-detail-view/store/order-detail.store';
import { ReceiptSummaryComponent } from '../receipt-summary/receipt-summary.component';

@Component({
  selector: 'admin-receipt-list',
  templateUrl: './receipt-list.component.html',
  imports: [
    Bind,
    Button,
    RouterLink,
    ReceiptSummaryComponent,
    I18nPluralPipe,
    Nl2brPipe,
    TranslatePipe,
    TooltipModule,
    Panel,
    Badge,
  ],
})
export class ReceiptListComponent {
  protected readonly store = inject(OrderDetailStore);
  protected readonly order = this.store.order;
  protected readonly receipts = this.store.receipts;
  protected readonly recordPermissions = this.store.receiptPermissions;

  get numberOfReceipt(): number {
    return this.store.receipts().length;
  }

  get createInfoMessage(): string {
    return this.store.receiptCreateInfoMessage();
  }
}
