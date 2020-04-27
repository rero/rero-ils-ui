/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  static readonly resource = 'libraries';

  constructor(
    private recordService: RecordService
  ) { }

  get count$() {
    return this.recordService.getRecords(
      LibraryService.resource,
      undefined,
      1,
      1
    ).pipe(
      map(results => results.hits.total)
    );
  }

  get$(pid: string) {
    return this.recordService.getRecord('libraries', pid);
  }

  allOrderBy$(order: string = 'name') {
    return this.recordService.getRecords(
      LibraryService.resource, undefined, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, order
    );
  }
}
