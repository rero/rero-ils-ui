// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from '../store/app.store';

@Pipe({
    name: 'extractSourceField',
    pure: false
})
export class ExtractSourceFieldPipe implements PipeTransform {

  protected appStore = inject(AppStore);
  protected translateService: TranslateService = inject(TranslateService);

  /**
   * Transform
   * @param metadata - metadata of record
   * @param field - string, field name
   * @return the requested field from metadata for the best possible source.
   */
  transform(metadata: any, field: string): any {
    let contributionsLabel: any;
    try {
      contributionsLabel = this.appStore.settings()?.agentLabelOrder;
    } catch {
      return null;
    }
    const language = this.translateService.getCurrentLang();
    const agentLabelOrder = (language in contributionsLabel)
      ? contributionsLabel[language]
      : contributionsLabel[contributionsLabel.fallback];
    for (const source of agentLabelOrder) {
      if (
        Object.hasOwn(metadata, source)
        && Object.hasOwn(metadata[source], field)
      ) {
        return metadata[source][field];
      }
    }
    return null;
  }

}
