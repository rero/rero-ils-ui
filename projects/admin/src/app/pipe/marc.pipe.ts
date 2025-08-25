/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
    name: 'marc',
    standalone: false
})
export class MarcPipe implements PipeTransform {

  transform(value: any): any {
    const values: any = {};

    const field: string = value[0];
    const subFields: string|any[] = value[1];
    let subFieldsStr = subFields;
    if (field.length === 6 && field !== 'leader') {
      const f = field.substring(0, 3);
      let ind1 = field.substring(4, 5);
      if (!ind1) {
        ind1 = ' ';
      }
      let ind2 = field.substring(5, 6);
      if (!ind2) {
        ind2 = ' ';
      }
      values.ind1 = ind1;
      values.ind2 = ind2;
      values.field = f;
    } else {
      values.field = field;
    }
    if (Array.isArray(subFields)) {
      subFieldsStr = '';
      for (const f of subFields) {
        subFieldsStr += `$${f[0]} ${f[1]} `;
      }
      subFieldsStr = subFieldsStr.trim();
    }
    values.value = subFieldsStr;
    return values;
  }

}
