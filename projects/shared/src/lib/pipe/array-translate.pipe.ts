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
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'arrayTranslate'
})
export class ArrayTranslatePipe implements PipeTransform {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Translate all elements
   * @param values - array of string
   * @return array of translated string
   */
  transform(values: string[]): string[] {
    const translated = [];
    if (values) {
      values.forEach((element: string) => {
        translated.push(this.translateService.instant(element));
      });
    }
    return translated;
  }
}
