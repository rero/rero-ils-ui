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

@Pipe({
  name: 'idAttribute'
})
export class IdAttributePipe implements PipeTransform {

  /**
   * Transform
   * @param value - value
   * @param options - object
   * @param args - array
   * @return any or string
   */
  transform(value: any, options?: {prefix?: string|null, suffix?: string|null}, ...args: any[]): any {
    // If no options, return only value
    if (!options) {
      return value;
    }

    let parts = [options.prefix || null, value, options.suffix || null];
    parts = parts.filter(v => v !== null);
    return parts.join('-');
  }
}
