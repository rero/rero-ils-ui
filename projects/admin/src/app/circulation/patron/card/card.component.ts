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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../class/user';
import { getBootstrapLevel } from '../../../utils/utils';


@Component({
  selector: 'admin-circulation-patron-detailed',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() patron: User;
  @Input() circulationMessages = false;
  @Output() clearPatron = new EventEmitter<User>();

  clear() {
    if (this.patron) {
      this.clearPatron.emit(this.patron);
    }
  }

  getBootstrapColor(level: string): string {
    return getBootstrapLevel(level);
  }
}
