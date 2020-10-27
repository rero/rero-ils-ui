/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { RecordService } from '@rero/ng-core';
import { Subject } from 'rxjs';
import { User } from '../class/user';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // CLASS ATTRIBUTES ================================================
  /** is user already loaded */
  public userLoaded = false;

  /** Subject emitting the user loaded */
  private onUserLoaded: Subject<User> = new Subject();

  /** user */
  private user: User;

  /** Allow interface access */
  private _allowInterfaceAccess = false;

  // GETTER FUNCTIONS ================================================
  /** return onUserLoaded subject as observable */
  get onUserLoaded$() {
    return this.onUserLoaded.asObservable();
  }

  /** Allow user interface access */
  get allowAccess() {
    return this._allowInterfaceAccess;
  }

  // CLASS CONSTRUCTOR ===============================================
  /**
   * Constructor
   * @param http - HttpClient
   * @param recordService - RecordService
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private http: HttpClient,
    private recordService: RecordService,
    private _appConfigService: AppConfigService
  ) { }

  // CLASS FUNCTIONS =================================================
  /**
   * Get the current user. Should be used only when the user is loaded
   * @return the current user as User class
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if the current load user has a specific role
   * @param role - string: the role to check
   * @return True is the user has the role, False otherwise
   */
  hasRole(role: string): boolean {
    return this.getCurrentUser().hasRole(role);
  }

  /**
   * Load the user resource corresponding to the user logged.
   * This function will populate the `user` class parameter and emit the user at the end
   */
  loadLoggedUser() {
    this.http.get<any>(User.LOGGED_URL).subscribe(data => {
      const user = data.metadata;
      if (user && user.library) {
        user.currentLibrary = user.library.pid;
      }
      this.user = new User(user);
      this._allowInterfaceAccess = this.isAuthorizedAccess();
      this.userLoaded = true;
      this.onUserLoaded.next(data);
    });
  }

  // private methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   * Check if the current logged user are an access ton admin interface
   * @return True is access is authorized, False otherwise
   */
  private isAuthorizedAccess(): boolean {
    return this.user.hasRoles(this._appConfigService.adminRoles, 'or');
 }
}
