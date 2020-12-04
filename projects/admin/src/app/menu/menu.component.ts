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
import { SearchBarConfigService, UserService } from '@rero/shared';

@Component({
  selector: 'admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  /** Collapsed menu */
  isCollapsed = true;

  /** Array of Record types */
  recordTypes = [];

  /** Max length suggestion */
  maxLengthSuggestion = 100;

  /** Autocomplte query params */
  autocompleteQueryParams: any = { page: '1', size: '10' };

  /**
   * Get Typehead option limit
   * @return number
   */
  get typeaheadOptionsLimit() {
    return this._searchBarConfigService.typeaheadOptionsLimit;
  }

  /**
   * Constructor
   * @param _userService - UserService
   * @param _searchBarConfigService - SearchBarConfigService
   */
  constructor(
    private _userService: UserService,
    private _searchBarConfigService: SearchBarConfigService
  ) {}

  /** Init */
  ngOnInit() {
    const currentUser = this._userService.user;
    this.autocompleteQueryParams.organisation = currentUser.currentOrganisation;

    this.recordTypes = this._searchBarConfigService.getConfig(
      true, this, undefined, this.maxLengthSuggestion
    );
  }
}
