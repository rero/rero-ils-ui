/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { IMenu, PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-menu',
  templateUrl: './patron-profile-menu.component.html'
})
export class PatronProfileMenuComponent {

  /**
   * Is menu visible
   * @return boolean
   */
  get isVisible(): boolean {
    return this._patronProfileMenuService.isMultiOrganisation;
  }

  /**
   * Get menu lines (organisation)
   * @return array
   */
  get menuOptions(): IMenu[] {
    return this._patronProfileMenuService.menu;
  }

  /**
   * Constructor
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _patronProfileMenuService: PatronProfileMenuService
  ) {}

  /** on change */
  onChange(patronPid: string): void {
    this._patronProfileMenuService.change(patronPid);
  }
}
