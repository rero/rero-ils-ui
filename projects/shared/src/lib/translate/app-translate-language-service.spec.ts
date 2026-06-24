// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TranslateLanguageService } from '@rero/ng-core';
import { AppTranslateLanguageService, ngCoreLanguage } from './app-translate-language-service';

describe('AppTranslateLanguageService', () => {
  const frData = { fre: 'français', deu: 'allemand' };
  const deData = { fre: 'Französisch', deu: 'Deutsch' };

  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((url: RequestInfo | URL) => {
      const lang = String(url).match(/\/(\w+)\.json$/)?.[1];
      const data = lang === 'fr' ? frData : lang === 'de' ? deData : {};
      return Promise.resolve({ json: () => Promise.resolve(data) } as Response);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be a subclass of TranslateLanguageService', () => {
    expect(AppTranslateLanguageService.prototype).toBeInstanceOf(TranslateLanguageService);
  });

  describe('ngCoreLanguage loaders', () => {
    it('de loader should fetch from ng-core languages assets', async () => {
      const result = await ngCoreLanguage('', 'de')();
      expect(fetch).toHaveBeenCalledWith('/assets/rero-ils-ui/ng-core/languages/de.json');
      expect(result).toEqual(deData);
    });

    it('fr loader should fetch from ng-core languages assets', async () => {
      const result = await ngCoreLanguage('', 'fr')();
      expect(fetch).toHaveBeenCalledWith('/assets/rero-ils-ui/ng-core/languages/fr.json');
      expect(result).toEqual(frData);
    });

    it('should prefix the fetch URL with the given base', async () => {
      await ngCoreLanguage('https://cdn.example', 'it')();
      expect(fetch).toHaveBeenCalledWith('https://cdn.example/assets/rero-ils-ui/ng-core/languages/it.json');
    });
  });
});
