/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
