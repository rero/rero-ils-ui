/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserApiService } from '../api/user-api.service';
import { IUser, User } from '../class/user';
import { AppSettingsService } from './app-settings.service';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // SERVICES ATTRIBUTES ======================================================
  /** Loaded observable */
  private _loaded: Subject<IUser> = new Subject<IUser>();
  /** user */
  private _user: User;

  // GETTER & SETTER ==========================================================
  /**
   * Get loaded observable
   * @return Observable<IUser>
   */
  get loaded$(): Observable<IUser> {
    return this._loaded.asObservable();
  }

  /** Get user */
  get user(): User {
    return this._user;
  }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _userApiService - UserApiService
   * @param _appSettingsService - AppSettingsService
   * @param _permissionsService - PermissionsService
   */
  constructor(
    private _userApiService: UserApiService,
    private _appSettingsService: AppSettingsService,
    private _permissionsService: PermissionsService
  ) { }

  /** load */
  load(): Observable<IUser> {
    return this._userApiService
      .getLoggedUser()
      .pipe(
        map((loggedUser: any) => {
          this._appSettingsService.settings = loggedUser.settings;
          delete loggedUser['settings'];
          if (loggedUser.permissions) {
          this._permissionsService.setPermissions(loggedUser.permissions);
        }
        this._user = new User(loggedUser);
          this._loaded.next(this._user);
          return this._user;
        })
    );
  }
}
