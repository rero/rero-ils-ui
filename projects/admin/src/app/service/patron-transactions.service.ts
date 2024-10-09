/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2022 UCLouvain
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

import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
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
      .getRecords('patron_transactions', `pid:${pid}`, 1, 1, undefined, undefined, BaseApi.reroJsonheaders)
      .pipe(
        map((result: Record) => this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
        map((hits: any) => hits.find(Boolean)),  // Get first element of array if exists
        map((hit: any) => new PatronTransaction(hit.metadata))
      );
  }
}
