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

import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-frontpage-board',
  templateUrl: './frontpage-board.component.html'
})
export class FrontpageBoardComponent {

  /** List of items to display */
  @Input() item: any;

  /**
   * Get item ID and add optional suffix on it
   * @param item menu item
   * @param suffix suffix to add after item id
   * @return a string
   */
  getId(item: any, suffix?: string): string {
    if (item.id !== null) {
      let res = item.id;
      if (suffix !== null) {
        res += suffix;
      }
      return res;
    }
  }
}
