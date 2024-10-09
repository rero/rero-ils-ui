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
  name: 'journalVolume'
})
export class JournalVolumePipe implements PipeTransform {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Transform
   * @param journal - Object
   * @param separator - string
   * @return string
   */
  transform(journal: { journal_title?: string, volume?: string, number?: string }, separator: string = ' — '): string {
    const data = [];
    if ('volume' in journal) {
      data.push(this.translateService.instant(
        'Vol. {{ volume }}', { volume: journal.volume }
      ));
    }
    if ('number' in journal) {
      data.push(this.translateService.instant(
        'n°. {{ number }}', { number: journal.number }
      ));
    }
    return data.join(separator);
  }
}
