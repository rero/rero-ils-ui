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
import { Router } from '@angular/router';
import { LibrarySwitchService } from './library-switch.service';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  /**
   * Constructor
   * @param _router - Router
   * @param _librarySwitchService - LibrarySwitchService
   */
  constructor(
    private _router: Router,
    private _librarySwitchService: LibrarySwitchService
  ) { }

  /** Initialize navigate event */
  initialize() {
    // After the current library changed, then reload the current page to force component to update
    // NOTE : just navigate on the current URL doesn't easily work because, with basic configuration, Angular
    //        doesn't reload component data if url doesn't change. Using the below trick, we are sure to update
    //        all components.
    this._librarySwitchService.currentLibraryRecord$.subscribe(() => {
      const currentFullURL = this._router.url;
      this._router.navigateByUrl('/', {skipLocationChange: true}).then(
        () => this._router.navigateByUrl(currentFullURL)
      );
    });
  }
}
