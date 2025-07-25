/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loanStatusBadge',
    standalone: false
})
export class LoanStatusBadgePipe implements PipeTransform {

  /**
   * Transform status to class
   * @param status - string
   * @return string
   */
  transform(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'ITEM_AT_DESK':
        return 'success';
      case 'ITEM_ON_LOAN':
        return 'info';
      case 'CANCELLED':
        return 'danger'
      default:
        return 'secondary';
    }
  }
}
