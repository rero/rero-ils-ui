/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { AppSettingsService } from '../service/app-settings.service';

@Pipe({
  name: 'extractSourceField',
  pure: false
})
export class ExtractSourceFieldPipe implements PipeTransform {

  protected appSettingsService: AppSettingsService = inject(AppSettingsService);
  protected translateService: TranslateService = inject(TranslateService);

  /**
   * Transform
   * @param metadata - metadata of record
   * @param field - string, field name
   * @return the requested field from metadata for the best possible source.
   */
  transform(metadata: any, field: string): any {
    const contributionsLabel: any = this.appSettingsService.agentLabelOrder;
    const language = this.translateService.currentLang;
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
