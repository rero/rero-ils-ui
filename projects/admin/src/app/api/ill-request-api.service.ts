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
import type { EsResult } from '@rero/ng-core';
import { RecordService } from '@rero/ng-core';
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
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    filters?: {[key: string]: string},
    sort = '-created'
  ): Observable<any> {
    const query = `patron.pid:${patronPid}`;
    return this.recordService
      .getRecords(this.RESOURCE_NAME, { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, preFilters: filters, headers: BaseApi.reroJsonheaders, sort })
      .pipe(map((result: EsResult) => result.hits.hits));
  }
}
