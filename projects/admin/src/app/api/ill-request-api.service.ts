/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { Record, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILLRequestStatus } from '../classes/ill-request';
import { BaseApi } from '@rero/shared';

@Injectable({
  providedIn: 'root'
})
export class IllRequestApiService extends BaseApi {

  /** Resource name */
  readonly RESOURCE_NAME = 'ill_requests';

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /**
   * Get ills requests with pending status by patron pid
   * @param patronPid - The patron pid
   * @returns Array of ill request record
   */
  getByPatronPid(patronPid: string): Observable<Record | Error> {
    const query = `patron.pid:${patronPid} AND status:${ILLRequestStatus.PENDING}`;
    return this._recordService
      .getRecords(
        this.RESOURCE_NAME, query , 1, RecordService.MAX_REST_RESULTS_SIZE,
        undefined, undefined, BaseApi.reroJsonheaders, 'created'
      ).pipe(map((result: Record) => result.hits.hits));
  }
}
