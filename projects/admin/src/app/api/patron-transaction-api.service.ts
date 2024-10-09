/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService, Record, RecordService } from '@rero/ng-core';
import { Observable, map } from 'rxjs';
import { FeeFormModel } from '../circulation/patron/patron-transactions/patron-fee/patron-fee.component';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);
  private recordService: RecordService = inject(RecordService);

  /**
   * Add fee
   * @return Observable, array of records
   */
  addFee(model: FeeFormModel): Observable<Object> {
    return this.httpClient.post(this.apiService.getEndpointByType('patron_transactions/'), model);
  }

  getActiveFeesByItemPid(itemPid: string): any {
    const query = `item.pid:${itemPid} AND total_amount:>0`;
    return this.recordService.getRecords('patron_transactions', query)
      .pipe(map((result: Record) => result.hits.hits));
  }
}
