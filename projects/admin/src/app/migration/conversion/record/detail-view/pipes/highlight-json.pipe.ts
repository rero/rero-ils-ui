// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Highlight a JSON structure.
 *
 * Copied from the SONAR project.
 */
@Pipe({ name: 'highlightJson' })
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
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match: any) => {
        let cls = 'ui:text-gray-600';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'ui:text-cyan-600';
          } else {
            cls = 'ui:text-orange-600';
          }
        } else if (/true|false/.test(match)) {
          cls = 'ui:text-blue-600';
        } else if (/null/.test(match)) {
          cls = 'ui:text-blue-600';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );

    return this.sanitizer.bypassSecurityTrustHtml(json);
  }
}
