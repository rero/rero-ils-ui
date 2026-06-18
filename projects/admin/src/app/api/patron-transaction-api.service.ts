// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { ApiService, RecordService } from '@rero/ng-core';
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
  addFee(model: FeeFormModel): Observable<object> {
    return this.httpClient.post(this.apiService.getEndpointByType('patron_transactions/'), model);
  }

  getActiveFeesByItemPid(itemPid: string): Observable<any> {
    const query = `item.pid:${itemPid} AND total_amount:>0`;
    return this.recordService.getRecords('patron_transactions', { query })
      .pipe(map((result: EsResult) => result.hits.hits));
  }
}
