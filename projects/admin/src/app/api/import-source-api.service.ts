// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ExternalSourceSetting } from '../classes/external-source';

@Injectable({
  providedIn: 'root'
})
export class ImportSourceApiService {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get the configuration entrypoint for external sources
   * @return: an Observable on external sources list
   */
  getSources(): Observable<ExternalSourceSetting[]> {
    return this.httpClient
      .get('/api/imports/config/')
      .pipe(
        map((sources: any[]) => sources.map(data => new ExternalSourceSetting(data))),
        catchError(() => [])
      );
  }

}
