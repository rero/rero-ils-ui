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

import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'patronBlockedMessage'
})
export class PatronBlockedMessagePipe implements PipeTransform {

  /**
   * Constructor
   * @param translate - TranslateService
   */
  constructor(private translate: TranslateService) {}

  /**
   * Display a message if patron is blocked
   * @param patron - Patron object
   */
  transform(patron: any, ...args: any[]): any {
    if (patron == null || patron.blocked !== true) {
      return null;
    }
    return `${this.translate.instant('This patron is currently blocked.')} ${this.translate.instant('Reason')}: ${patron.blocked_note}`;
  }
}
