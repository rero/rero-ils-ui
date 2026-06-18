// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { CircPolicy } from '../../classes/circ-policy';
import { Loan } from '../../classes/loans';
import { LoanService } from '../../service/loan.service';

@Pipe({ name: 'getLoanCipo' })
export class GetLoanCipoPipe implements PipeTransform {

  private loanService: LoanService = inject(LoanService);

  /**
   * Search an return the circulation policy related to a loan.
   * @param loan - the source loan
   * @returns Observable on the related CircPolicy
   */
  transform(loan: Loan): Observable<CircPolicy> {
    return this.loanService.getCirculationPolicy(loan.pid);
  }

}
