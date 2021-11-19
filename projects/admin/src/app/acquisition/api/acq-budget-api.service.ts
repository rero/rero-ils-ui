/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { Record, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqAccount } from '../classes/account';
import { AcqBudget } from '../classes/budget';

@Injectable({
  providedIn: 'root'
})
export class AcqBudgetApiService {

  /** The resource name of acquisition budget */
  resourceName = 'budgets';

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) { }


  /**
   * Get the budget corresponding to filters.
   * @param query: query to apply to find records
   * @return an observable of budget
   */
  getBudgets(query?: string): Observable<AcqBudget[]> {
    query = query || '';
    return this._recordService.getRecords(this.resourceName, query, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: Array<any>) => hits.map((hit: any) => new AcqBudget(hit.metadata)))
      );
  }

  /**
   * Get the sum of all allocated_amount accounts related to a budget
   * @param budgetPid: The budget pid.
   * @return An observable with the total amount for this budget.
   */
  getBudgetTotalAmount(budgetPid: string): Observable<number> {
    return this._recordService
      .getRecords('acq_accounts', `budget.pid:${budgetPid} AND depth:0`, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .pipe(
        map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: Array<any>) => hits.map((hit: any) => new AcqAccount(hit.metadata))),
        map((accounts: Array<AcqAccount>) => accounts.reduce((total, acc) => total + acc.allocated_amount, 0))
      );
  }
}
