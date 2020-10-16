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
import { TranslateService } from '@ngx-translate/core';
import { SharedConfigService } from '../service/shared-config.service';

@Pipe({
  name: 'extractSourceField',
  pure: false
})
export class ExtractSourceFieldPipe implements PipeTransform {

  /**
   * Constructor
   * @param _appConfigService - AppConfigService
   */
  constructor(
    private _sharedConfigService: SharedConfigService,
    private _translateService: TranslateService
    ) {}

  /**
   * Transform
   * @param metadata - metadata of record
   * @param field - string, field name
   * @return string or null
   */
  transform(metadata: any, field: string): string | null {
    const contributionsLabel: any = this._sharedConfigService.contributionsLabelOrder;
    const language = this._translateService.currentLang;
    const contributionsLabelOrder = (language in contributionsLabel)
      ? contributionsLabel[language]
      : contributionsLabel[contributionsLabel.fallback];
    for (const source of contributionsLabelOrder) {
      if (
        metadata.hasOwnProperty(source)
        && metadata[source].hasOwnProperty(field)
      ) {
        return metadata[source][field];
      }
    }
    return null;
  }

}
