// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';
import { IAcqAccount } from '../classes/account';

@Pipe({ name: 'accountAvailableAmount' })
export class AccountAvailableAmountPipe implements PipeTransform {

  /**
   * Get the self available amount for an AcqAccount.
   * This amount is the result of the following calculation : allocated_amount - children distribution
   * @param account - the account to analyze.
   * @returns the available amount
   */
  transform(account: IAcqAccount): number {
    return account.allocated_amount - account.distribution;
  }

}
