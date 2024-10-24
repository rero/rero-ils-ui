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

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PredictionIssue } from './holdings.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get record from rero-ils API
   * @param source: the source where to find the data
   * @param pid: the pid corresponding to the data to load
   * @returns observable of null if the record does not exists else an
   * observable containing the record
   */
  getRecordFromExternal(source: string, pid: string): Observable<any> {
    return this.httpClient.get<any>(`/api/import_${source}/${pid}`).pipe(
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    );
  }

  /**
   * Get some preview example for given serial patterns.
   * @param data object containing the patterns serial prediction
   * @param size the number of preview samples
   * @returns an object with an issues property containing the list of samples
   */
  getHoldingPatternPreview(data: any, size = 10): Observable<PredictionIssue[]> {
    return this.httpClient.post<any>(`/api/holding/pattern/preview`, {
      data: data.patterns,
      size
    }).pipe(
      map(result => result.issues)
    );
  }
}
