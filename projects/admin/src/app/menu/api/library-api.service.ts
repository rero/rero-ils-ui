/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Injectable, inject } from '@angular/core';
import { RecordService } from '@rero/ng-core';

@Injectable({
  providedIn: 'root'
})
export class LibraryApiService {

  private recordService = inject(RecordService);

  /** Resource name */
  static readonly resource = 'libraries';

  findByLibrariesPidAndOrderBy$(pids: string[], order: string = 'name') {
    return this.query('pid:' + pids.join(' OR pid:'), order);
  }

  private query(query: any, order: string = 'name') {
    return this.recordService.getRecords(
      LibraryApiService.resource, query, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, order
    );
  }
}
