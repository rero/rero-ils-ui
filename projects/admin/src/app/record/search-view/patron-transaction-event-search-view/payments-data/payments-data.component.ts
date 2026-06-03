/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
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
import { Component, input, model, ChangeDetectionStrategy} from '@angular/core';
import { PaymentData } from '../interfaces';
import { Bind } from 'primeng/bind';
import { Fieldset } from 'primeng/fieldset';
import { TranslateDirective } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { PaymentsDataTableComponent } from './table/payments-data-table.component';
import { PaymentDataPieComponent } from './pie/payment-data-pie.component';

@Component({
    selector: 'admin-payments-data',
    templateUrl: './payments-data.component.html',
    imports: [Bind, Fieldset, TranslateDirective, Button, PaymentsDataTableComponent, PaymentDataPieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsDataComponent {

  /** the payment data to display. */
  data = input<PaymentData>();
  /** How the data should be displayed. */
  mode = model<'table' | 'pie'>('table');

  /**
   * Update the display mode to switch between allowed values as a carousel.
   * @param event: triggering event.
   */
  updateMode(_event: Event) {
    switch (this.mode()) {
      case 'pie': this.mode.set('table'); break;
      case 'table': this.mode.set('pie'); break;
    }
  }
}
