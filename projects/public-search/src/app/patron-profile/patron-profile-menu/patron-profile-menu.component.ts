/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, Input } from '@angular/core';
import { IMenu, PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-menu',
  templateUrl: './patron-profile-menu.component.html'
})
export class PatronProfileMenuComponent {

  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  @Input() patronPid: string;

  /**
   * Is menu visible
   * @return boolean
   */
  get isVisible(): boolean {
    return this.patronProfileMenuService.isMultiOrganisation;
  }

  /**
   * Get menu lines (organisation)
   * @return array
   */
  get menuOptions(): IMenu[] {
    const menuSelected = this.patronProfileMenuService.menu
      .find((menu: any) => menu.value === this.patronPid);
    if (menuSelected) {
      menuSelected.selected = true;
    }
    return this.patronProfileMenuService.menu;
  }

  /** on change */
  onChange(patronPid: string): void {
    this.patronProfileMenuService.change(patronPid);
  }
}
