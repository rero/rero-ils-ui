/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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

import { Component, inject, Input } from '@angular/core';
import { ProvisionActivityType, OperationLogsApiService } from '@rero/shared';

@Component({
    selector: 'admin-history-log',
    templateUrl: './history-log.component.html',
    standalone: false
})
export class HistoryLogComponent {

  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);

  /** Log to display */
  @Input() log: any;

  /** Is collapsed */
  isCollapsed = true;

  /** ProvisionActivityType reference */
  provisionActivityType = ProvisionActivityType;

  /** Checkout record operation logs */
  checkoutLoaded: boolean = false;

  events: any[] = [];

  /** Load checkout */
  loadCheckout() {
    if (!this.checkoutLoaded) {
      this.operationLogsApiService
        .getHistoryByLoanPid(this.log.metadata.loan.pid, 'checkout')
        .subscribe((log: any) => {
          this.checkoutLoaded = true;
          this.log.metadata['type'] = 'Checkin';
          this.events = [this.log.metadata];
          if (log) {
            log.metadata['type'] = 'Checkout';
            this.events.push(log.metadata);
          }
        });
    }
  }
}
