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
import { Pipe, PipeTransform } from '@angular/core';
import { Notification } from '../../../../classes/notification';

@Pipe({
    name: 'notificationType',
    standalone: false
})
export class NotificationTypePipe implements PipeTransform {

  /** type of notification by type */
  private _notification = Notification.types;

  /**
   * Transform
   * @param notification - string
   * @param type - string
   * @return boolean
   */
  transform(notification: string, type: string): boolean {
    return Object.keys(this._notification).includes(type)
      && this._notification[type].includes(notification);
  }
}
