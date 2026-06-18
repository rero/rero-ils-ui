// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { PaymentData } from '../../interfaces';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'admin-payments-data-table',
    templateUrl: './payments-data-table.component.html',
    imports: [Bind, Divider, TranslateDirective, CurrencyPipe, TranslatePipe],
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
