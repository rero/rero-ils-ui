// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { CORE_TRANSLATION_LOADERS, CoreConfigService, CoreTranslateLoader, TranslationLoaderFn, versionedUrl } from '@rero/ng-core';

// Without version, the file URL does not change between deployments:
// the browser must revalidate it to avoid serving stale translations.
export const ngCoreI18n = (base: string, lang: string, version = ''): TranslationLoaderFn =>
  () => fetch(
    versionedUrl(`${base}/assets/rero-ils-ui/ng-core/i18n/${lang}.json`, version),
    { cache: version ? 'default' : 'no-cache' }
  )
    .then(r => r.json())
    .then(data => ({ default: data }));

@Injectable()
export class AppTranslateLoader extends CoreTranslateLoader {
  constructor() {
    super();
    const { ngCoreAssetsUrl, translationsVersion } = inject(CoreConfigService);
    const base = ngCoreAssetsUrl ?? '';
    this.coreTranslationLoaders = {
      ...CORE_TRANSLATION_LOADERS,
      de: ngCoreI18n(base, 'de', translationsVersion),
      fr: ngCoreI18n(base, 'fr', translationsVersion),
      it: ngCoreI18n(base, 'it', translationsVersion),
    };
  }
}
