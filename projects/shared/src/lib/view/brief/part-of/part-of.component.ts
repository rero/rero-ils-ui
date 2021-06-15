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

import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'shared-part-of',
  templateUrl: './part-of.component.html'
})
export class PartOfComponent {

  /** Document */
  @Input() record: any;

  /** View code */
  @Input() viewcode: string = null;

  /** is public view */
  @Input() isPublicView = false;

  /** Is it brief or detailed view? */
  @Input() isBrief = true;

  /** Css class for dd in template */
  ddCssClass = 'col-sm-6 col-md-8 mb-0';

  /** constructor
   * @param _translateService - TranslateService to translate some strings.
   */
  constructor(
    private _translateService: TranslateService
  ) { }

  /**
   * Get "part of" label from host document type
   * @param hostDocument - host document
   * @return corresponding translated label
   */
  getPartOfLabel(hostDocument: any) {
    switch (hostDocument.metadata.issuance.subtype) {
      case 'periodical':
          return this._translateService.instant('Journal');
      case 'monographicSeries':
          return this._translateService.instant('Series');
      default:
           return this._translateService.instant('Published in');
    }
  }

  /**
   * Get short main title
   * @param titles - document titles
   * @return - main title to display
   */
  getShortMainTitle(titles: any) {
    const bfTitles: Array<any> = titles.filter((title: any) => title.type === 'bf:Title');
    for (const bfTitle of bfTitles) {
      for (const mainTitle of bfTitle.mainTitle) {
        if (!mainTitle.language) {
          return mainTitle.value;
        }
      }
    }
  }

  /**
   * Format "part of" numbering for display
   *
   * @param num: numbering to format
   * @return formatted numbering (example: 2020, vol. 2, nr. 3, p. 302)
   */
  formatNumbering(num: any) {
    const numbering = [];
    if (num.year) {
      numbering.push(num.year);
    }
    if (num.volume) {
      const volume = [this._translateService.instant('vol'), num.volume];
      numbering.push(volume.join('. '));
    }
    if (num.issue) {
      const issue = [this._translateService.instant('nr'), num.issue];
      numbering.push(issue.join('. '));
    }
    if (num.pages) {
      const pages = [this._translateService.instant('p'), num.pages];
      numbering.push(pages.join('. '));
    }
    return numbering.join(', ');
  }

  /**
   * Get list of document edition statement
   * @return array - edition statement
   */
  getStatement(statements: any) {
    if (null === statements) {
      return [];
    }
    const results = [];
    statements.forEach((element: any) => {
      if ('_text' in element) {
        const elementText = element._text;
        const keys = Object.keys(elementText);
        const indexDefault = keys.indexOf('default');
        if (indexDefault > -1) {
          results.push(elementText.default);
          keys.splice(indexDefault, 1);
        }

        keys.forEach(key => {
          results.push(elementText[key]);
        });
      }
    });
    return results;
  }
}
