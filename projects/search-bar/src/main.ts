/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
