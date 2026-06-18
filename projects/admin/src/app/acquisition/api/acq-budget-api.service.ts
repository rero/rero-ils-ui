// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { accountDefaultData, IAcqAccount } from '../classes/account';
import { AcqBudget } from '../classes/budget';

@Injectable({
  providedIn: 'root'
})
export class AcqBudgetApiService {

  private recordService: RecordService = inject(RecordService);

  /** The resource name of acquisition budget */
  resourceName = 'budgets';

  /**
   * Get the budget corresponding to filters.
   * @param query: query to apply to find records
   * @return an observable of budget
   */
  getBudgets(query?: string): Observable<AcqBudget[]> {
    query = query || '';
    return this.recordService.getRecords(this.resourceName, { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map((hit: any) => new AcqBudget(hit.metadata)))
      );
  }

  /**
   * Get the sum of all allocated_amount accounts related to a budget
   * @param budgetPid: The budget pid.
   * @return An observable with the total amount for this budget.
   */
  getBudgetTotalAmount(budgetPid: string): Observable<number> {
    return this.recordService
      .getRecords('acq_accounts', {
        query: `budget.pid:${budgetPid} AND depth:0`,
        page: 1,
        itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE
      })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any[]) => hits.map((hit: any) => ({...accountDefaultData, ...hit.metadata}) )),
        map((accounts: IAcqAccount[]) => accounts.reduce((total, acc) => total + acc.allocated_amount, 0))
      );
  }
}
