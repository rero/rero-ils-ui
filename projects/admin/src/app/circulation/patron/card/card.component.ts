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
import moment from 'moment';
import { User } from '../../../class/user';
import { getBootstrapLevel } from '../../../utils/utils';


@Component({
  selector: 'admin-circulation-patron-detailed',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  /** the patron */
  @Input() patron: User;
  /** is the circulation messages should be displayed */
  @Input() circulationMessages = false;
  /** which link should be use on the main patron name */
  @Input() linkMode: 'circulation'|'detail' = 'detail';
  /** event emitter when the close button are fired */
  @Output() clearPatron = new EventEmitter<User>();

  /** Build the link used on the patron name */
  get patronLink(): string {
    if (this.patron) {
      return (this.linkMode === 'detail')
        ? '/records/patrons/detail/' + this.patron.pid
        : '/circulation/patron/' + this.patron.patron.barcode + '/loan';
    }
  }

  /** Get the patron age */
  get patronAge(): number {
    if (this.patron && this.patron.birth_date) {
      return moment().diff(this.patron.birth_date, 'years');
    }
  }

  /** Defined if it's the birthday of the patron */
  get isBirthday(): boolean {
    if (this.patron && this.patron.birth_date) {
      const today = moment().format('YYYY-MM-DD');
      const age = moment(today).diff(this.patron.birth_date, 'years', true);
      return age % 1 === 0;
    }
    return false;
  }

  clear() {
    if (this.patron) {
      this.clearPatron.emit(this.patron);
    }
  }

  getBootstrapColor(level: string): string {
    return getBootstrapLevel(level);
  }

}
