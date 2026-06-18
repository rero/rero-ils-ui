// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeApiService {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get All
   * @return Observable, array of records
   */
  getAll(): Observable<any[]> {
    return this.recordService
      .getRecords('item_types', { query: '', page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE })
      .pipe(map((response: EsResult) => response.hits.hits));
  }
}
