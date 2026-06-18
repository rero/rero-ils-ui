// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


/** This pipe allows to find the best possible label to used from an array of labels.
 *  Each label must define 2 keys : `language` and `label` ::
 *
 *  [
 *    {'language': 'fr', 'label': 'mon label'},
 *    {'language': 'en', 'label': 'my label'},
 *     ...
 *  ]
 *
 *  The label to find depending on the language. If the requested language label doesn't find
 *  into the array entries, the first label entry will be returned.
 */

@Pipe({
    name: 'getTranslatedLabel',
    pure: true
})
export class GetTranslatedLabelPipe implements PipeTransform {

  protected translateService: TranslateService = inject(TranslateService);

  /**
   * get the best possible label
   * @param entries: all the labels to search
   * @param language: (optional) the language code to search. If this argument isn't supply,
   *                  the current used interface language will be used.
   * @return: the best possible label.
   */
  transform(entries: {language: string, label: string}[], language?: string): string | null {
    if (!Array.isArray(entries)) {
      return null;
    }
    language = language || this.translateService.getCurrentLang();
    const labels = entries.filter(entry => entry.language === language);
    if (labels.length > 0) {  // We find a correct entry ! Return the label
      return labels[0].label;
    } else if (entries.length > 0) {  // we didn't find any entry. Return the first label from the input entries.
      return this.translateService.instant(entries[0].label);
    }
    return null;
  }

}
