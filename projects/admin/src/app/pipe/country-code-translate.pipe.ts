// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'countryCodeTranslate' })
export class CountryCodeTranslatePipe implements PipeTransform {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Get the translation for a country code
   * @param countryCode - the country code (2 characters)
   * @returns string the translated country code.
   */
  transform(countryCode: string): string {
    return this.translateService.instant('country_' + countryCode);
  }

}
