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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserApiService } from '../api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  /** Subject Event */
  private _onLoggedUserLoaded: Subject<any> = new Subject();

  /** user is loaded */
  private _loaded = false;

  /** Logged User Observable */
  get onLoggedUserLoaded$() {
    return this._onLoggedUserLoaded.asObservable();
  }

  /** Loaded */
  get loaded() {
    return this._loaded;
  }

  /**
   * Constructor
   * @param _httpClient - HttpClient
   */
  constructor(private _userApi: UserApiService) { }

  /**
   * Load current user with applications settings
   */
  public load() {
    this._userApi.getLoggedUser().subscribe(data => {
      this._onLoggedUserLoaded.next(data);
      this._loaded = true;
    });
  }
}
