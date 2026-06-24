// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CoreTranslateLoader } from '@rero/ng-core';
import { AppTranslateLoader, ngCoreI18n } from './app-translate-loader';

describe('AppTranslateLoader', () => {
  it('should be a subclass of CoreTranslateLoader', () => {
    expect(AppTranslateLoader.prototype).toBeInstanceOf(CoreTranslateLoader);
  });

  describe('ngCoreI18n loaders', () => {
    it('de loader should fetch from ng-core i18n assets', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ greeting: 'Hallo' }),
      } as Response);

      const result = await ngCoreI18n('', 'de')();

      expect(fetchSpy).toHaveBeenCalledWith('/assets/rero-ils-ui/ng-core/i18n/de.json');
      expect(result).toEqual({ default: { greeting: 'Hallo' } });
    });

    it('fr loader should fetch from ng-core i18n assets', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ bonjour: 'Bonjour' }),
      } as Response);

      const result = await ngCoreI18n('', 'fr')();

      expect(fetchSpy).toHaveBeenCalledWith('/assets/rero-ils-ui/ng-core/i18n/fr.json');
      expect(result).toEqual({ default: { bonjour: 'Bonjour' } });
    });

    it('it loader should fetch from ng-core i18n assets', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ saluto: 'Ciao' }),
      } as Response);

      const result = await ngCoreI18n('', 'it')();

      expect(fetchSpy).toHaveBeenCalledWith('/assets/rero-ils-ui/ng-core/i18n/it.json');
      expect(result).toEqual({ default: { saluto: 'Ciao' } });
    });
  });
});
