/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { ApiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronApiService extends BaseApi {

  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);

  /**
   * Get Messages
   * @return Observable
   */
  getMessages(patronPid: string): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`/api/patrons/${patronPid}/messages`);
  }

    /**
   * Get circulation statistics about a patron
   * @param patronPid - string : the patron pid to search
   * @return Observable
   */
  getCirculationInformations(patronPid: string): Observable<any> {
    const url = [this.apiService.getEndpointByType('patrons'), patronPid, 'circulation_informations'].join('/');
    return this.httpClient.get(url);
  }

  getOverduePreviewByPatronPid(patronPid: string): Observable<any> {
    return this.httpClient.get(`/api/patrons/${patronPid}/overdues/preview`);
  }
}

/** Message envelop */
export type Message = {
  type: string;
  content: string;
}
