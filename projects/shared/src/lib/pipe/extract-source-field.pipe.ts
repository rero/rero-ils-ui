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
import { AppSettingsService } from '../service/app-settings.service';

@Pipe({
  name: 'extractSourceField',
  pure: false
})
export class ExtractSourceFieldPipe implements PipeTransform {

  /**
   * Constructor
   * @param _appSettingsService - AppSettingsService
   * @param _translateService - TranslateService
   */
  constructor(
    private _appSettingsService: AppSettingsService,
    private _translateService: TranslateService
    ) {}

  /**
   * Transform
   * @param metadata - metadata of record
   * @param field - string, field name
   * @return string or null
   */
  transform(metadata: any, field: string): string | null {
    const contributionsLabel: any = this._appSettingsService.agentLabelOrder;
    const language = this._translateService.currentLang;
    const agentLabelOrder = (language in contributionsLabel)
      ? contributionsLabel[language]
      : contributionsLabel[contributionsLabel.fallback];
    for (const source of agentLabelOrder) {
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
