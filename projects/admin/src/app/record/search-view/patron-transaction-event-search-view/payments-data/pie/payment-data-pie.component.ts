// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PaymentData } from '../../interfaces';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { UIChart } from 'primeng/chart';

@Component({
    selector: 'admin-payments-data-pie',
    templateUrl: './payment-data-pie.component.html',
    imports: [Bind, UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentDataPieComponent implements OnInit {
  private appStore = inject(AppStore);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** The payment data to display. */
  data = input<PaymentData>();

  values: any;
  options: any;

  /** OnInit hook */
  ngOnInit() {
    const data = this.data();
    if (data?.subtypes) {
      this.values = {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
      data.subtypes.map((subtype) => {
        this.values.labels.push(this.translateService.instant(subtype.name));
        this.values.datasets[0].data.push(subtype.total);
      });
    }
    this.options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.formattedValue || '';
              return ` ${label} ${this.appStore.organisation()?.default_currency ?? ''}`;
            },
          },
        },
      },
    };
  }
}
