/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'patronBlockedMessage'
})
export class PatronBlockedMessagePipe implements PipeTransform {

  protected translate: TranslateService = inject(TranslateService);

  /**
   * Display a message if patron is blocked
   * @param patron - Patron object
   */
  transform(patron: any): any {
    if (patron == null || patron.patron == null || patron.patron.blocked !== true) {
      return null;
    }
    return `${this.translate.instant(
      'This patron is currently blocked.')} ${this.translate.instant('Reason')}: ${patron.patron.blocked_note}`;
  }
}
