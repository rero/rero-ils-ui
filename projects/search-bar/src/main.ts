// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { RemoteSearchComponent } from '@rero/shared';
import { appConfig } from './app/app.config';

if (!customElements.get('main-search-bar')) {
  createApplication(appConfig).then(appRef => {
    const searchBar = createCustomElement(RemoteSearchComponent, { injector: appRef.injector });
    customElements.define('main-search-bar', searchBar);
  }).catch(err => console.error(err));
}
