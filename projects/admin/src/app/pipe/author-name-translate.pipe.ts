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
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'authorNameTranslate'
})
export class AuthorNameTranslatePipe implements PipeTransform {

  /**
   * Constructor
   * @param translate - TranslateService
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transform a name by current language interface
   * @param author - Author object
   */
  transform(author: any): string {
    return this.translateName(author);
  }

  /**
   * translateName
   * @param author - Author object
   */
  private translateName(author: any) {
    const indexName = `name_${this.translate.currentLang}`;
    let lngName = author[indexName];
    if (!lngName) {
      lngName = author.name;
    }
    if (author.qualifier) {
      lngName += ' ' + author.qualifier;
    }
    if (author.date) {
      lngName += ' ' + author.date;
    }
    return lngName;
  }
}
