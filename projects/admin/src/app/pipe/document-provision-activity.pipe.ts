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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentProvisionActivity'
})
export class DocumentProvisionActivityPipe implements PipeTransform {

  /**
   * Process provision activity field
   * @param provisionActivity - provision activity data
   * @returns Object
   */
  transform(provisionActivity: any): object {
    if (undefined === provisionActivity) {
      return [];
    }
    const results = {};
    provisionActivity
      .filter((element: any) => '_text' in element && 'statement' in element)  // Keep only element with '_text'
      .map((element: any) => {
        const { type } = element;
        if (!(type in results)) {  // if type isn't yet init
          results[type] = [];
        }
        element._text.map((e: { language: string, value: string }) => results[type].push(e.value));
      });
    return results;
  }
}
