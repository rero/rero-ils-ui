/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { OperationLogsApiService } from '@app/admin/api/operation-logs-api.service';
import { ProvisionActivityType } from '@rero/shared';

@Component({
  selector: 'admin-history-log',
  templateUrl: './history-log.component.html'
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
  checkout: any = null;

  /** Load checkout */
  loadCheckout() {
    if (this.checkout === null) {
      this.operationLogsApiService
        .getHistoryByLoanPid(this.log.metadata.loan.pid, 'checkout')
        .subscribe((log: any) => {
          this.checkout = log;
        });
    }
  }
}
