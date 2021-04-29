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
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'journalVolume'
})
export class JournalVolumePipe implements PipeTransform {

  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  public constructor(private _translateService: TranslateService) {}

  /**
   * Transform
   * @param journal - Object
   * @param separator - string
   * @return string
   */
  transform(journal: { volume?: string, number?: string }, separator: string = ' &mdash; '): string {
    const data = [];
    if ('volume' in journal) {
      data.push(this._translateService.instant(
        'Vol. {{ volume }}', { volume: journal.volume }
      ));
    }
    if ('number' in journal) {
      data.push(this._translateService.instant(
        'n°. {{ number }}', { number: journal.number }
      ));
    }
    return data.join(separator);
  }
}
