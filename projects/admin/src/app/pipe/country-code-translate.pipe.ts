/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
  name: 'countryCodeTranslate'
})
export class CountryCodeTranslatePipe implements PipeTransform {

  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  constructor(private _translateService: TranslateService) {}

  /**
   * Get the translation for a country code
   * @param countryCode - the country code (2 characters)
   * @returns string the translated country code.
   */
  transform(countryCode: string): string {
    return this._translateService.instant('country_' + countryCode);
  }

}
