// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import type { Error, EsResult } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronTransactionEventApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get Events
   * @param feePid - string
   * @return Observable
   */
  getEvents(feePid: string, sort = 'created'): Observable<EsResult | Error> {
    return this.recordService.getRecords(
      'patron_transaction_events',
      { query: `parent.pid:${feePid}`, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, headers: BaseApi.reroJsonheaders, sort }
    );
  }
}
