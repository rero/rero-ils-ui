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

@Pipe({
    name: 'mainTitleRelation',
    standalone: false
})
export class MainTitleRelationPipe implements PipeTransform {

  /**
   * Extract main title for relation
   * @param value - array of title field
   * @returns the first main title with _text field
   */
  transform(value: any[]): string {
    const mainTitle = value.filter((title: any) => title.type === 'bf:Title');
    return mainTitle[0]._text;
  }
}
