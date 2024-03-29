/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Injectable } from '@angular/core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronApiService extends BaseApi {

  /**
   * Constructor
   * @param _httpClient - HttpClient
   */
  constructor(private _httpClient: HttpClient) {
    super();
  }

  /**
   * Get Messages
   * @return Observable
   */
  getMessages(patronPid: string): Observable<Message[]> {
    return this._httpClient.get<Message[]>(`/api/patrons/${patronPid}/messages`);
  }
}

/** Message envelop */
export interface Message {
  type: string;
  content: string;
}
