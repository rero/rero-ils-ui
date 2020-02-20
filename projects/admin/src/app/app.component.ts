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
import { Component, OnInit } from '@angular/core';
import { AppRouterEventService } from './service/app-router-event.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** User loaded by Observable */
  private _userLoaded = false;

  /** Allow interface access */
  get allowAccess() {
    return this._userService.allowAccess;
  }

  /** User loaded */
  get userLoaded() {
    return this._userLoaded;
  }

  /**
   * Constructor
   * @param _userInterfaceAccessService - UserInterfaceAccessService
   * @param userService - UserService
   */
  constructor(
    private _userService: UserService,
    private _appRouterEventService: AppRouterEventService
    ) { }

    /** Init */
  ngOnInit() {
    this._appRouterEventService.initializeEvents();
    this._userService.onUserLoaded$.subscribe((data: any) => {
      this._userLoaded = true;
      // Initialize event only if user is logged
      if (data.metadata) {
        this._appRouterEventService.initializeEvents();
      }
    });
  }
}
