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
import { NgxSpinnerService } from 'ngx-spinner';
import { AppRouterEventService } from './service/app-router-event.service';
import { NavigateService } from './service/navigate.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** Allow interface access */
  get allowAccess() {
    return this._userService.allowAccess;
  }

  /** is user loaded */
  get userLoaded() {
    return this._userService.userLoaded;
  }

  /**
   * Constructor
   * @param _userService - UserService
   * @param _appRouterEventService - AppRouterEventService
   * @param _spinner - NgxSpinnerService
   * @param _navigateService - NavigateService
   */
  constructor(
    private _userService: UserService,
    private _appRouterEventService: AppRouterEventService,
    private _spinner: NgxSpinnerService,
    private _navigateService: NavigateService
    ) {}

    /** Init */
  ngOnInit() {
    this._spinner.show();
    this._appRouterEventService.initializeEvents();
    this._navigateService.initialize();
    this._spinner.hide();
  }
}
