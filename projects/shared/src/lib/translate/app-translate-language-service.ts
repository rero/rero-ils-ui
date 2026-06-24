// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { CoreConfigService, LanguageLoaderFn, TranslateLanguageService } from '@rero/ng-core';

const SUPPORTED_LANGUAGES = ['de', 'fr', 'it'];

export const ngCoreLanguage = (base: string, lang: string): LanguageLoaderFn =>
  () => fetch(`${base}/assets/rero-ils-ui/ng-core/languages/${lang}.json`).then(r => r.json());

@Injectable({ providedIn: 'root' })
export class AppTranslateLanguageService extends TranslateLanguageService {
  private coreConfigService = inject(CoreConfigService);

  constructor() {
    super();
    this.translateService.onLangChange.subscribe(({ lang }) => {
      if (SUPPORTED_LANGUAGES.includes(lang) && !(lang in this.availableLanguages)) {
        const base = this.coreConfigService.ngCoreAssetsUrl ?? '';
        this.loadLanguages({ [lang]: ngCoreLanguage(base, lang) }).catch(() => {
          // Swallow to avoid breaking the language switch on asset load failure
        });
      }
    });
  }

  loadLanguageNow(lang: string): Promise<void> {
    if (SUPPORTED_LANGUAGES.includes(lang) && !(lang in this.availableLanguages)) {
      const base = this.coreConfigService.ngCoreAssetsUrl ?? '';
      return this.loadLanguages({ [lang]: ngCoreLanguage(base, lang) }).catch(() => undefined);
    }
    return Promise.resolve();
  }
}
