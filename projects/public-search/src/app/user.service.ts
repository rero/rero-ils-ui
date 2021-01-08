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
import { Injectable } from '@angular/core';
import { LoggedUserService } from '@rero/shared';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** Current user loggegd */
  private currentUser: any;

  /** Get user */
  get user() {
    return this.currentUser;
  }

  /**
   * Constructor
   * @param _loggedUserService - LoggedUserService
   */
  constructor(private _loggedUserService: LoggedUserService) {}

  init() {
    this._loggedUserService.onLoggedUserLoaded$
      .pipe(map(data => data.metadata ? data.metadata : undefined))
      .subscribe(user => this.currentUser = user);
  }
}
