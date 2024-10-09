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
import { Component, Input } from '@angular/core';
import { PaymentData } from '../interfaces';

@Component({
  selector: 'admin-payments-data',
  templateUrl: './payments-data.component.html',
  styleUrls: ['./payment-data.scss']
})
export class PaymentsDataComponent {

  /** the payment data to display. */
  @Input() data: PaymentData;
  /** How the data should be displayed. */
  @Input() mode: 'table' | 'pie' = 'table';

  /**
   * Update the display mode to switch between allowed values as a carousel.
   * @param event: triggering event.
   */
  updateMode(event: Event) {
    switch (this.mode) {
      case 'pie': this.mode = 'table'; break;
      case 'table': this.mode = 'pie'; break;
    }
  }
}
