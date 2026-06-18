// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { OrderDetailStore } from '../../order/order-detail-view/store/order-detail.store';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ReceiptSummaryComponent } from '../receipt-summary/receipt-summary.component';
import { I18nPluralPipe } from '@angular/common';
import { Nl2brPipe } from '@rero/ng-core';
import { TooltipModule } from 'primeng/tooltip';
import { Panel } from 'primeng/panel';
import { Badge } from 'primeng/badge';

@Component({
    selector: 'admin-receipt-list',
    templateUrl: './receipt-list.component.html',
    imports: [TranslateDirective, Bind, Button, RouterLink, ReceiptSummaryComponent, I18nPluralPipe, Nl2brPipe, TranslatePipe, TooltipModule, Panel, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
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
