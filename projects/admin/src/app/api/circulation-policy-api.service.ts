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
import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CirculationPolicyApiService {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get All
   * @param excludedPid, string
   * @return Observable, array of records
   */
  getAll(excludedPid?: string): Observable<any[]> {
    const query = excludedPid ? `NOT pid:${excludedPid}` : '';
    return this.recordService
      .getRecords('circ_policies', query, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .pipe(map((response: Record) => response.hits.hits));
  }
}
