/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ApiService } from '@rero/ng-core';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  /** API Prefix, i.e. /api. */
  private _apiPrefix = '';

  /**
   * Constructor
   * @param _httpClient - HttpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private _apiService: ApiService
  ) {
    this._apiPrefix = this._apiService.endpointPrefix;
  }

  /**
   * Get logged user
   * @return Observable
   */
  getLoggedUser() {
    return this._httpClient.get<any>(User.LOGGED_URL);
  }

  /**
   * Update a patron password.
   *
   * @param username - patron username
   * @param password - new password
   * @return Observable
   */
  public changePassword(username: string, password: string) {
    const data = {
      username,
      new_password: password
    };
    const url = `${this._apiPrefix}/change-password`;
    return this._httpClient.post<any>(url, data);
  }
}
