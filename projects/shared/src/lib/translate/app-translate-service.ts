// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import { Injectable } from '@angular/core';
import { de } from '@openng/optimus-ui-locale/js/de.js';
import { fr } from '@openng/optimus-ui-locale/js/fr.js';
import { it } from '@openng/optimus-ui-locale/js/it.js';
import { CORE_LOCALES, Locales, NgCoreTranslateService } from '@rero/ng-core';

@Injectable({ providedIn: 'root' })
export class AppTranslateService extends NgCoreTranslateService {
  override locales: Locales = {
    ...CORE_LOCALES,
    de: { angular: localeDe, optimusUI: de },
    fr: { angular: localeFr, optimusUI: fr },
    it: { angular: localeIt, optimusUI: it },
  };
}
