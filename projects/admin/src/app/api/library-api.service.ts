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
export class LibraryApiService {

  private recordService: RecordService = inject(RecordService);

  /**
   * Get library by pid
   * @param pid - the library pid
   * @returns the library metadata
   */
  getByPid(pid: string): Observable<any> {
    return this.recordService.getRecord('libraries', pid)
      .pipe(map(record => record.metadata));
  }
}
