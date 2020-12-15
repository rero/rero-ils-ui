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

import { TranslateService } from '@ngx-translate/core';
import { MenuItemInterface } from '@rero/ng-core';

export class MenuBase {

  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  constructor(protected translateService: TranslateService) {}

  /**
   * Translate menu with a name
   * @param menu - MenuItemInterface
   * @param name - name of menu
   */
  protected _translatedName(menu: MenuItemInterface, name: string) {
    this.translateService.stream(name).subscribe((translated: string) => {
      menu.setName(translated);
    });
  }
}
