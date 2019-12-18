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
import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { LibrarySwitchService } from '../service/library-switch.service';

@Component({
  selector: 'admin-interface-info',
  templateUrl: './interface-info.component.html'
})
export class InterfaceInfoComponent {

  /**
   * Constructor
   * @param librarySwitchService - LibrarySwitchService
   * @param userService - UserService
   */
  constructor(
    private librarySwitchService: LibrarySwitchService,
    private userService: UserService
  ) { }

  /**
   * Get Library name
   * @return null or string
   */
  get libraryName() {
    if (!this.librarySwitchService.currentLibrary) {
      return;
    }
    return this.librarySwitchService.currentLibrary.name;
  }

  /**
   * the user is system admin
   * @return boolean
   */
  get isSystemLibrarian() {
    return this.userService.hasRole('system_librarian');
  }
}
