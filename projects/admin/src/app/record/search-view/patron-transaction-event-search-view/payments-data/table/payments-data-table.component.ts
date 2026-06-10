/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { PaymentData } from '../../interfaces';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CentsCurrencyPipe } from '../../../../../acquisition/pipes/cents-currency.pipe';

@Component({
    selector: 'admin-payments-data-table',
    templateUrl: './payments-data-table.component.html',
    imports: [Bind, Divider, TranslateDirective, CentsCurrencyPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsDataTableComponent {

  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =====================================================
  data = input<PaymentData>();

  // GETTER & SETTER ==========================================================
  /** Organisation currency */
  get org_currency() {
    return this.appStore.organisation()?.default_currency;
  }
}
