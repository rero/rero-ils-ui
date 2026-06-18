// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { DocumentDetailViewComponent } from '@app/public-search/document-detail/document-detail-view/document-detail-view.component';
import { appConfig } from './app/app.config';

createApplication(appConfig).then(appRef => {
  const injector = appRef.injector;
  if (!customElements.get('public-search-document')) {
    const documentDetail = createCustomElement(DocumentDetailViewComponent, { injector });
    customElements.define('public-search-document', documentDetail);
  }
}).catch(err => console.error(err));
