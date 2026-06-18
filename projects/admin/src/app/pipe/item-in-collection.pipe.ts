// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Pipe, PipeTransform } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'itemInCollection' })
export class ItemInCollectionPipe implements PipeTransform {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get Exhibition/course for current item
   * @param itemPid - Item pid
   * @returns Observable
   */
  transform(itemPid: string|undefined): Observable<[] | null> {
    if(itemPid === undefined) {
      return of([]);
    }
    return this.recordService.getRecords(
      'collections',
      { query: `items.pid:${itemPid} AND published:true`, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: 'title' }
    ).pipe(
      map((result: any) => {
        return (+this.recordService.totalHits(result.hits.total) === 0)
          ? []
          : result.hits.hits;
      })
    );
  }
}
