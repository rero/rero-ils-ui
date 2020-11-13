/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Injectable } from '@angular/core';
import { ILLRequestStatus } from '../class/ill-request';
import { LoanState } from '../class/items';

@Injectable({
  providedIn: 'root'
})
export class IllRequestsService {

  /**
   * Get the bootstrap color to apply on the request status badge
   * @param status: the status to check
   * @return the bootstrap color to use for this request (badge, alert, ...).
   */
  badgeColor(status: any): string {
    if (status) {
      switch (status) {
        case ILLRequestStatus.PENDING:
        case LoanState.PENDING:
          return 'warning';
        case ILLRequestStatus.VALIDATED:
        case LoanState.ITEM_AT_DESK:
          return 'success';
        case ILLRequestStatus.DENIED:
          return 'danger';
        case LoanState.ITEM_ON_LOAN:
        case LoanState.ITEM_RETURNED:
          return 'info';
        default:
          return 'secondary';
      }
    }
    return 'secondary';
  }
}
