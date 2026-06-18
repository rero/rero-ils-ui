// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
