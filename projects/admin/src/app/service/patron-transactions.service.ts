// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatronTransaction } from '../classes/patron-transaction';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionsService {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get patron transaction by pid
   * @param pid: the patron transaction pid
   * @return an observable on corresponding patron transaction.
   */
  getPatronTransaction(pid: string): Observable<PatronTransaction> {
    // DEV NOTE :
    //   We use `getRecords` instead of `getRecord` in order to benefit of the
    //   records search serialization
    return this.recordService
      .getRecords('patron_transactions', { query: `pid:${pid}`, page: 1, itemsPerPage: 1, headers: BaseApi.reroJsonheaders })
      .pipe(
        map((result: EsResult) => +this.recordService.totalHits((result.hits as any).total) === 0 ? [] : (result.hits as any).hits),
        map((hits: any) => hits.find(Boolean)),  // Get first element of array if exists
        map((hit: any) => new PatronTransaction(hit.metadata))
      );
  }
}
