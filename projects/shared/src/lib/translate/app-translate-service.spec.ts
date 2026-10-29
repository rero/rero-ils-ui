// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import { de } from '@openng/optimus-ui-locale/js/de.js';
import { fr } from '@openng/optimus-ui-locale/js/fr.js';
import { it as itLocale } from '@openng/optimus-ui-locale/js/it.js';
import { CORE_LOCALES, NgCoreTranslateService } from '@rero/ng-core';

import { AppTranslateService } from './app-translate-service';

describe('AppTranslateService', () => {
  it('should be a subclass of NgCoreTranslateService', () => {
    expect(AppTranslateService.prototype).toBeInstanceOf(NgCoreTranslateService);
  });

  it('should declare locale data for de, fr and it', () => {
    expect(localeDe).toBeDefined();
    expect(localeFr).toBeDefined();
    expect(localeIt).toBeDefined();
    expect(de).toBeDefined();
    expect(fr).toBeDefined();
    expect(itLocale).toBeDefined();
  });

  it('CORE_LOCALES should contain at least one language', () => {
    expect(Object.keys(CORE_LOCALES).length).toBeGreaterThan(0);
  });
});
