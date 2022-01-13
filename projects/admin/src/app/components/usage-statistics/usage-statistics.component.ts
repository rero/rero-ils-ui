/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { UserService } from '@rero/shared';

@Component({
  selector: 'admin-usage-statistics',
  templateUrl: './usage-statistics.component.html'
})
export class UsageStatisticsComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** current user library pid */
  libraryPid: string = null;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _userService - UserService
   */
  constructor(
    private _userService: UserService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    const user = this._userService.user;
    if (user) {
      this.libraryPid = user.currentLibrary;
    }
  }
}
