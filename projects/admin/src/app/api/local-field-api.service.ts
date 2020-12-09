/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { RecordService, RecordUiService } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalFieldApiService {

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService
  ) { }

  /**
   * Get Local field for current resource and organisation user
   * @param resourceType - string, parent type of resource
   * @param resourcePid - string, parent pid of resource
   * @param organisationPid - string, pid of organisation
   * @return Observable
   */
  getByResourceTypeAndResourcePidAndOrganisationId(
    resourceType: string,
    resourcePid: string,
    organisationPid: string
  ) {
    const query = [
      `parent.type:${resourceType}`,
      `parent.pid:${resourcePid}`,
      `organisation.pid:${organisationPid}`,
    ].join(' AND ');

    return this._recordService.getRecords('local_fields', query, 1, 1).pipe(
      map((result: any) => {
        return this._recordService.totalHits(result.hits.total) === 1
          ? result.hits.hits[0]
          : {};
      })
    );
  }

  /**
   * Delete local fields by resource pid
   * @param resourcePid - string, pid of resource
   * @return Observable
   */
  delete(resourcePid: string) {
    return this._recordUiService.deleteRecord('local_fields', resourcePid);
  }
}
