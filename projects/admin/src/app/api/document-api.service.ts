/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {

  /** Ressource name */
  readonly RESOURCE_NAME = 'documents';

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) { }

  /**
   * Get count of linked document(s) from current document (partOf)
   * @param documentPid - document pid
   * @returns Observable<int>
   */
  getLinkedDocumentsCount(documentPid: string): Observable<number> {
    return this._recordService.getRecords(
      this.RESOURCE_NAME, `partOf.document.pid:${documentPid}`, 1, 1
    ).pipe(map((result: Record) => result.hits.total.value));
  }
}
