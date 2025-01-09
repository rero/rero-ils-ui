/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Highlight a JSON structure.
 *
 * Copied from the SONAR project.
 */
@Pipe({
  name: 'highlightJson',
})
export class HighlightJsonPipe implements PipeTransform {

  // services
  protected sanitizer: DomSanitizer = inject(DomSanitizer);

  /**
   * Highlight a JSON structure.
   *
   * @param value Json structure.
   * @return Highlighted string.
   */
  transform(value: string): any {
    if (value == null) {
      return;
    }
    let json = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(?:\r\n|\r|\n)/g, '<br>')
      .replace(/( )/g, '&ensp;');

    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match: any) => {
        let cls = 'text-gray-600';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-cyan-600';
          } else {
            cls = 'text-orange-600';
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-blue-600';
        } else if (/null/.test(match)) {
          cls = 'text-blue-600';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
    const html = this.sanitizer.bypassSecurityTrustHtml(json);
    return html;
  }
}
