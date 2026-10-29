// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Fieldset } from '@openng/optimus-ui/fieldset';

import { PaymentData } from '../interfaces';
import { PaymentDataPieComponent } from './pie/payment-data-pie.component';
import { PaymentsDataTableComponent } from './table/payments-data-table.component';

@Component({
  selector: 'admin-payments-data',
  templateUrl: './payments-data.component.html',
  imports: [TranslatePipe, Bind, Fieldset, Button, PaymentsDataTableComponent, PaymentDataPieComponent],
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
      case 'pie':
        this.mode.set('table');
        break;
      case 'table':
        this.mode.set('pie');
        break;
    }
  }
}
