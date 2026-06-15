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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcqOrderStatus } from '../../../classes/order';
import { OrderDetailStore } from '../order-detail-view/store/order-detail.store';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { CentsCurrencyPipe } from '../../../pipes/cents-currency.pipe';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-order-summary',
    templateUrl: './order-summary.component.html',
    imports: [TranslateDirective, RouterLink, Bind, Tag, NgTemplateOutlet, AsyncPipe, CentsCurrencyPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryComponent {

  protected readonly store = inject(OrderDetailStore);
  protected readonly order = this.store.order;

  acqOrderStatus = AcqOrderStatus;
}
