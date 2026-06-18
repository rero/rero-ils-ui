// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationApiService {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get Organisation by pid
   * @param pid - the organisation pid
   * @returns the organisation data
   */
  getByPid(pid: string): Observable<any> {
    return this.recordService.getRecord('organisations', pid)
      .pipe(map(record => record.metadata));
  }
}
