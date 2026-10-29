// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Divider } from '@openng/optimus-ui/divider';
import { AppStore } from '@rero/shared';

import { PaymentData } from '../../interfaces';

@Component({
  selector: 'admin-payments-data-table',
  templateUrl: './payments-data-table.component.html',
  imports: [Bind, Divider, CurrencyPipe, TranslatePipe],
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
