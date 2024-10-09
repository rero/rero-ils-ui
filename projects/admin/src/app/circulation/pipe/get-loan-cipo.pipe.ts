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

import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { CircPolicy } from '../../classes/circ-policy';
import { Loan } from '../../classes/loans';
import { LoanService } from '../../service/loan.service';

@Pipe({
  name: 'getLoanCipo'
})
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
