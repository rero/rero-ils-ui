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
import { forkJoin, of, Subject } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { User } from '../class/user';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** Event after user loaded */
  private onUserLoaded: Subject<User> = new Subject();

  /** User object */
  private user: User;

  /** Allow interface access */
  private _allowInterfaceAccess = false;

  /**
   * Public event for user loaded
   * @return Observable
   */
  get onUserLoaded$() {
    return this.onUserLoaded.asObservable();
  }

  /** Allow user interface access */
  get allowAccess() {
    return this._allowInterfaceAccess;
  }

  /**
   * Constructor
   * @param _http - HttpClient
   * @param _recordService - RecordService
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService,
    private _appConfigService: AppConfigService
  ) { }

  /**
   * Get current user
   * @return User
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Has role
   * @param role - string
   * @return boolean
   */
  hasRole(role: string) {
    return this.getCurrentUser().hasRole(role);
  }

  /**
   * Has roles
   * @param roles - array
   * @return boolean
   */
  hasRoles(roles: Array<string>) {
    return this.getCurrentUser().hasRoles(roles);
  }

  /** Load Logged User */
  public loadLoggedUser() {
    this._http.get<any>(User.LOGGED_URL).subscribe(data => {
      const user = data.metadata;
      if (user && user.library) {
        user.currentLibrary = user.library.pid;
      }
      this.user = new User(user);
      this.isAuthorizedAccess();
      this.onUserLoaded.next(data);
    });
  }

  /**
   * Get User by pid
   * @param pid - string
   * @return Observable
   */
  getUser(pid: string) {
    return this._recordService.getRecord('patrons', pid, 1).pipe(
      map(data => {
        if (data) {
          const patron = new User(data.metadata);
          return forkJoin(
              of(patron),
              this._recordService.getRecord('patron_types', patron.patron_type.pid)
              ).pipe(
                map(patronAndType => {
                  const newPatron = patronAndType[0];
                  const patronType = patronAndType[1];
                  if (patronType) {
                    newPatron.patron_type = patronType.metadata;
                  }
                  return newPatron;
                })
          );
        }
      }),
      concatAll()
    );
  }

  /**
   * Check if you are an access ton admin interface
   */
  private isAuthorizedAccess() {
    const adminRoles = this._appConfigService.adminRoles;
    this._allowInterfaceAccess = this.user.getRoles()
    .filter((role: string) => {
      if (adminRoles.indexOf(role) > -1) {
        return role;
      }
    }).length > 0;
 }
}
