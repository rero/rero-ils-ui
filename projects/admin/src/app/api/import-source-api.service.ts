/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
  getSources(): Observable<Array<ExternalSourceSetting>> {
    return this.httpClient
      .get('/api/imports/config/')
      .pipe(
        map((sources: any[]) => sources.map(data => new ExternalSourceSetting(data))),
        catchError(() => [])
      );
  }

}
