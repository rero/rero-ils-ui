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
