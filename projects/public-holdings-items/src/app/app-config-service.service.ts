// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@rero/ng-core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends CoreConfigService {

  /** Global View Name */
  globalViewName: string;

  /** Translation urls */
  translationsURLs: string[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.production = environment.production;
    this.apiBaseUrl = environment.apiBaseUrl;
    this.$refPrefix = environment.$refPrefix;
    this.languages = environment.languages;
    this.globalViewName = environment.globalViewName;
    this.translationsURLs = environment.translationsURLs;
  }
}
