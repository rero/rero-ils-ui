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
    name: 'mainTitle',
    standalone: false
})
export class MainTitlePipe implements PipeTransform {

  /**
   * extract the main title from document metadata
   * @param titleMetadata:  the document title metadata (as `getRecord` response with resolve=1)
   * @return string: the document main title or null if no title found.
   */
  transform(titleMetadata: any): string | null {
    if (titleMetadata == null) {
      return null;
    }
    const mainTitles: Array<any> = titleMetadata.filter(title => title.type === 'bf:Title');
    return (mainTitles.length > 0)
      ? mainTitles.pop()._text
      : null;
  }
}
