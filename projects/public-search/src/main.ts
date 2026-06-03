// to solve error on the rero-ils public search page due to the webpack bundle
import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';

import { RemoteSearchComponent } from '@rero/shared';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    if (!customElements.get('main-search-bar')) {
      const injector = appRef.injector;
      const searchBar = createCustomElement(RemoteSearchComponent, { injector });
      customElements.define('main-search-bar', searchBar);
    }
  })
  .catch(err => console.error(err));
