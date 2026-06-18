// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'arrayTranslate' })
export class ArrayTranslatePipe implements PipeTransform {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Translate all elements
   * @param values - array of string
   * @return array of translated string
   */
  transform(values: string[]): string[] {
    const translated = [];
    if (values) {
      values.forEach((element: string) => {
        translated.push(this.translateService.instant(element));
      });
    }
    return translated;
  }
}
