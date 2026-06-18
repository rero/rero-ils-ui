// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loanStatusBadge',
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
