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

  /** subject about current user loading */
  private onUserLoaded: Subject<User> = new Subject();

  /** the current logged user object */
  private user: User;

  public userLoaded = false;

  /** Allow interface access */
  private _allowInterfaceAccess = false;

  /** get the onUserLoaded subject as an obervable */
  get onUserLoaded$() {
    return this.onUserLoaded.asObservable();
  }

  /** Allow user interface access */
  get allowAccess() {
    return this._allowInterfaceAccess;
  }

  /** Constructor
   * @param _http: HTTPClient
   * @param _recordService: RecordService
   * @param _appConfigService: AppConfigService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService,
    private _appConfigService: AppConfigService
  ) { }

  /** Return the current logged user */
  getCurrentUser() {
    return this.user;
  }

  /** Is the user has a specific role ?
   * @param role: the role to check
   * @return True if the user has the requested role, false otherwise
   */
  hasRole(role: string): boolean {
    return this.getCurrentUser().hasRole(role);
  }

  /** Load all necessary information about the logged user.
   *  When the user is loaded, the `onLoadedUser` subject is emitted
   */
  loadLoggedUser() {
    this._http.get<any>(User.LOGGED_URL).subscribe(data => {
      const user = data.metadata;
      if (user && user.library) {
        user.currentLibrary = user.library.pid;
      }
      this.user = new User(user);
      this.isAuthorizedAccess();
      this.userLoaded = true;
      this.onUserLoaded.next(data);
    });
  }

  /** get an User object based oon its pid
   *  @param pid - string: the user pid
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
