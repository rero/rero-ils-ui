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
import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { OrganisationService } from '../../../../../service/organisation.service';
import { PaymentData } from '../../interfaces';

@Component({
  selector: 'admin-payments-data-pie',
  templateUrl: './payment-data-pie.component.html',
  styleUrls: ['./payment-data-pie.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PaymentDataPieComponent implements OnInit {

  private organisationService: OrganisationService = inject(OrganisationService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** The payment data to display. */
  @Input() data: PaymentData;

  /** variable used to display pie-chart with ngx-charts. */
  values: any[] = [];
  view: any[] = [230, 230];
  legendDisplay = true;
  legendTitle = '';
  legendPosition = LegendPosition.Below;
  animation = false;


  // GETTER & SETTER ==========================================================
  /** Organisation currency */
  get org_currency() {
    return this.organisationService.organisation.default_currency;
  }

  /** OnInit hook */
  ngOnInit() {
    if (this.data.subtypes) {
      this.data.subtypes.map(subtype => this.values.push({
        name: this.translateService.instant(subtype.name),
        value: subtype.total
      }));
    }
  }

}
