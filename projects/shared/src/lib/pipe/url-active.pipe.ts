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
  name: 'urlActive'
})
export class UrlActivePipe implements PipeTransform {

  transform(text: string, target: string = '_self'): any {
    let output = text;
    const re = new RegExp(/(https?:\/\/[\w|.|\-|\/]+)/, 'gm');
    let match: RegExpExecArray;
    // tslint:disable-next-line: no-conditional-assignment
    while ((match = re.exec(text)) !== null) {
      const url = match[0];
      output = output.replace(url, `<a href="${url}" target="${target}">${url}</a>`);
    }
    return output;
  }

}
