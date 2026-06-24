// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@rero/ng-core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends CoreConfigService {

  constructor() {
    super();
    this.production = environment.production;
    this.translationsURLs = environment.translationsURLs;
    this.ngCoreAssetsUrl = environment.ngCoreAssetsUrl ?? '';
  }
}
