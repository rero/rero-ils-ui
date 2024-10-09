/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IllRequestApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /** Resource name */
  readonly RESOURCE_NAME = 'ill_requests';

  /**
   * Get ills requests with pending status by patron pid
   * @param patronPid - The patron pid
   * @param filters - criteria to apply on the query to filter the result.
   * @returns Array of ill request record
   */
  getByPatronPid(
    patronPid: string,
    filters?: {[key: string]: string},
    sort: string = '-created'
  ): Observable<Record | Error> {
    const query = `patron.pid:${patronPid}`;
    return this.recordService
      .getRecords(this.RESOURCE_NAME, query , 1, RecordService.MAX_REST_RESULTS_SIZE,
                  undefined, filters, BaseApi.reroJsonheaders, sort)
      .pipe(map((result: Record) => result.hits.hits));
  }
}
