// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Injectable } from '@angular/core';
import { CoreConfigService } from '@rero/ng-core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends CoreConfigService {

  public adminRoles: string[];

  public librarySwitchCheckParamsUrl: string[];

  constructor() {
    super();
    this.production = environment.production;
    this.projectTitle = environment.projectTitle;
    this.apiBaseUrl = environment.apiBaseUrl;
    this.$refPrefix = environment.$refPrefix;
    this.schemaFormEndpoint = '/schemas';
    this.defaultLanguage = environment.defaultLanguage;
    this.adminRoles = environment.adminRoles;
    this.translationsURLs = environment.translationsURLs;
    this.ngCoreAssetsUrl = environment.ngCoreAssetsUrl ?? '';
    this.librarySwitchCheckParamsUrl = environment.librarySwitchCheckParamsUrl;
  }
}
