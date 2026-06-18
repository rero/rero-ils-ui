// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable, inject } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryApiService {

  private recordService: RecordService = inject(RecordService);

  /** Resource name */
  static readonly resource = 'libraries';

  findByLibrariesPidAndOrderBy$(pids: string[], order = 'name'): Observable<any> {
    return this.query('pid:' + pids.join(' OR pid:'), order);
  }

  private query(query: any, order = 'name'): Observable<any> {
    return this.recordService.getRecords(
      LibraryApiService.resource, { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: order }
    );
  }
}
