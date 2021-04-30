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
import { AppSettingsService } from '@rero/shared';

@Pipe({
  name: 'subjectProcess'
})
export class SubjectProcessPipe implements PipeTransform {

  /**
   * Constructor
   * @param _appSettingsService - AppSettingsService
   */
  constructor(private _appSettingsService: AppSettingsService) {}

  /**
   * Transform
   * @param subjects - subjects of record
   * @param language - current language
   * @return array of type and text
   */
  transform(subjects: any, language: string = 'en'): { type: string, text: string}[] {
    const orders = this._appSettingsService.contributionsLabelOrder;
    const output = [];
    subjects.forEach((subject: any) => {
      const data = {
        type: subject.type,
        text: null
      };
      if ('$schema' in subject) {
        let source = null;
        if (!(Object.keys(orders).some(order => order === language))) {
          language = orders.fallback;
        }
        orders[language].every((s: string) => {
          if (s in subject) {
            source = subject[s];
            return false;
          }
          return true;
        });
        data.text = source.preferred_name;
      }
      if ('term' in subject) {
        data.text = subject.term;
      } else {
        if ('preferred_name' in subject) {
          data.text = subject.preferred_name;
        } else {
          if ('title' in subject) {
            let text = subject.title;
            if ('creactor' in subject) {
              text += ' / ' + subject.creator;
            }
            data.text = text;
          }
        }
      }
      output.push(data);
    });
    return output;
  }

}
