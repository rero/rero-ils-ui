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
import { map } from 'rxjs/operators';
import { User } from '../class/user';
import { LoggedUserService } from './logged-user.service';
import { SharedConfigService } from './shared-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Observable on user loaded
   */
  private _onUserLoaded: Subject<User> = new Subject();

  /**
   * User
   */
  private _user: User = undefined;

  /** Flag service loaded after loggedUser is done */
  private _loaded = false;

  /**
   * Allowed access to admin interface
   */
  private _allowAdminInterfaceAccess = false;

  /**
   * On user loaded
   * @return observable
   */
  get onUserLoaded$() {
    return this._onUserLoaded.asObservable();
  }

  /**
   * Get User
   * @return User
   */
  get user() {
    return this._user;
  }

  get loaded() {
    return this._loaded;
  }

  /**
   * Get Access admin allowed
   */
  get allowAdminInterfaceAddess() {
    return this._allowAdminInterfaceAccess;
  }

  /**
   *
   * @param _loggedUserService - LoggedUserService
   * @param _sharedConfigService - SharedConfigService
   */
  constructor(
    private _loggedUserService: LoggedUserService,
    private _sharedConfigService: SharedConfigService
  ) { }

  /** Init */
  init() {
    this._subscribeEvent();
  }

  /**
   * Subcribe to event
   */
  private _subscribeEvent() {
    this._loggedUserService.onLoggedUserLoaded$
      .pipe(map(data => {
        return data.metadata ? data.metadata : undefined;
      })).subscribe(user => {
        if (user) {
          const library = user.libraries[0];
          this._user = new User(user);
          this.user
              .setCurrentLibrary(library.pid)
              .setCurrentOrganisation(library.organisation.pid);
          this._allowAdminInterfaceAccess = this._isAuthorizedAccess();
          this._onUserLoaded.next(this._user);
        }
        this._loaded = true;
      });
  }

  /**
   * Is authorized to admin access
   * @return boolean
   */
  private _isAuthorizedAccess() {
    const adminRoles = this._sharedConfigService.adminRoles;
    return this._allowAdminInterfaceAccess = this._user.getRoles()
    .filter((role: string) => {
      if (adminRoles.indexOf(role) > -1) {
        return role;
      }
    }).length > 0 ? true : false;
 }
}
