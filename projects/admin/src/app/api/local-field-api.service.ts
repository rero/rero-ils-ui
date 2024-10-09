/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { Record, RecordService, RecordUiService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalFieldApiService {

  private recordService: RecordService = inject(RecordService);
  private recordUiService: RecordUiService = inject(RecordUiService);

  /**
   * Get Local field for current resource and organisation user
   * @param resourceType - string, parent type of resource
   * @param resourcePid - string, parent pid of resource
   * @param organisationPid - string, pid of organisation
   * @return Observable
   */
  getByResourceTypeAndResourcePidAndOrganisationId(resourceType: string, resourcePid: string, organisationPid: string): Observable<any> {
    const query = `parent.type:${resourceType} AND parent.pid:${resourcePid} AND organisation.pid:${organisationPid}`;

    return this.recordService
      .getRecords('local_fields', query, 1, 1)
      .pipe(
        map((result: Record) => {
          return this.recordService.totalHits(result.hits.total) === 0
            ? {}
            : result.hits.hits[0];
        })
      );
  }

  /**
   * Delete local fields by resource pid
   * @param resourcePid - string, pid of resource
   * @return Observable
   */
  delete(resourcePid: string) {
    return this.recordUiService.deleteRecord('local_fields', resourcePid);
  }
}
