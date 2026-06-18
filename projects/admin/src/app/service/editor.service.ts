// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
