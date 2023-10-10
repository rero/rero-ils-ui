/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
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
import { MenuItem, MenuItemInterface } from '@rero/ng-core';
import { LibrarySwitchMenuEventService } from '../service/library-switch-menu-event.service';
import { LibrarySwitchMenuService } from '../service/library-switch-menu.service';

@Component({
  selector: 'admin-menu-switch-library',
  templateUrl: './menu-switch-library.component.html'
})
export class MenuSwitchLibraryComponent {

  /** Menu libraries switch */
  get menuLibrariesSwitch(): MenuItemInterface {
    return this._librarySwitchMenuService.menu;
  }

  /** Menu is visible */
  get isVisible(): boolean {
    return this._librarySwitchMenuService.visible;
  }

  /**
   * Constructor
   * @param _librarySwitchMenuService - LibrarySwitchMenuService
   * @param _librarySwitchMenuEventService - LibrarySwitchMenuEventService
   */
  constructor(
    private _librarySwitchMenuService: LibrarySwitchMenuService,
    private _librarySwitchMenuEventService: LibrarySwitchMenuEventService
  ) { }

  /**
   * Event on menu click
   * @param event - MenuItem
   */
  eventMenuClick(event: MenuItem): void {
    this._librarySwitchMenuEventService.eventMenuClick(event);
  }
}
