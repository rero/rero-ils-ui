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
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
import { SearchBarConfigService, UserService } from '@rero/shared';
import { filter } from 'rxjs/operators';

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

  /** Autocomplete query params */
  autocompleteQueryParams: any = { page: '1', size: '10' };

  /** Is document url */
  private hideSearchElement = false;

  /** Resources involved in hiding the search area */
  private hideSearchResources = ['documents'];

  /**
   * Get Typeahead option limit
   * @return number
   */
  get typeaheadOptionsLimit(): number {
    return this._searchBarConfigService.typeaheadOptionsLimit;
  }

  /**
   * Get hide search
   * @return boolean
   */
  get hideSearch(): boolean {
    return this.hideSearchElement;
  }

  /**
   * Constructor
   * @param _userService - UserService
   * @param _searchBarConfigService - SearchBarConfigService
   * @param _router - Router
   */
  constructor(
    private _userService: UserService,
    private _searchBarConfigService: SearchBarConfigService,
    private _router: Router
  ) { }

  /** Init */
  ngOnInit() {
    this._hideSearch();
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this._hideSearch());
    const currentUser = this._userService.user;
    this.autocompleteQueryParams.organisation = currentUser.currentOrganisation;

    this.recordTypes = this._searchBarConfigService.getConfig(
      true, this, undefined, this.maxLengthSuggestion
    );
  }

  /** Search the resource to determine whether to hide the search  */
  private _hideSearch(): void {
    const paths = [];
    this._router.parseUrl(this._router.url).root.children.primary?.segments
      .some((segment: UrlSegment) => { paths.push(segment.path); });
    const resourceFlag = paths.some((path: string) => this.hideSearchResources.includes(path));
    if (!resourceFlag) {
      this.hideSearchElement = false;
    } else {
      const detailFlag = paths.includes('detail');
      this.hideSearchElement = !(resourceFlag && detailFlag);
    }
  }
}
