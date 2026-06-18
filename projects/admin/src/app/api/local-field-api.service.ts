// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { RecordService, RecordUiService } from '@rero/ng-core';
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
      .getRecords('local_fields', { query, page: 1, itemsPerPage: 1 })
      .pipe(
        map((result: EsResult) => {
          return +this.recordService.totalHits(result.hits.total) === 0
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
