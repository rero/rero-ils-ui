/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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

import { inject, Pipe, PipeTransform } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'itemInCollection',
    standalone: false
})
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
      `items.pid:${itemPid} AND published:true`,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      undefined,
      'title'
    ).pipe(
      map((result: any) => {
        return (this.recordService.totalHits(result.hits.total) === 0)
          ? []
          : result.hits.hits;
      })
    );
  }
}
