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

import { Injectable } from '@angular/core';
import { LoggedUserService } from './logged-user.service';

@Injectable({
  providedIn: 'root'
})
export class SharedConfigService {

  /** Contribution agent types */
  contributionAgentTypes = {
    'bf:Person': 'persons',
    'bf:Organisation': 'corporate-bodies'
  };

  /** Admin roles */
  adminRoles: string[] = ['system_librarian', 'librarian'];

  /** Contribution sources */
  contributionSources: string[] = [];

  /** Contribution label order */
  contributionsLabelOrder = {};

  /**
   * Constructor
   * @param _loggedUserService - LoggedUserService
   */
  constructor(private _loggedUserService: LoggedUserService) { }

  /** Init */
  init() {
    this._loggedUserService.onLoggedUserLoaded$.subscribe((data: any) => {
      const settings = data.settings;
      this.contributionSources = settings.contributionSources;
      this.contributionsLabelOrder = settings.contributionsLabelOrder;
    });
  }
}
