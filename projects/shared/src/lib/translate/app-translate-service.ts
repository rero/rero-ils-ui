// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import { Injectable } from '@angular/core';
import { CORE_LOCALES, Locales, NgCoreTranslateService } from '@rero/ng-core';
import { de } from 'primelocale/js/de.js';
import { fr } from 'primelocale/js/fr.js';
import { it } from 'primelocale/js/it.js';

@Injectable({ providedIn: 'root' })
export class AppTranslateService extends NgCoreTranslateService {
  override locales: Locales = {
    ...CORE_LOCALES,
    de: { angular: localeDe, primeng: de },
    fr: { angular: localeFr, primeng: fr },
    it: { angular: localeIt, primeng: it },
  };
}
