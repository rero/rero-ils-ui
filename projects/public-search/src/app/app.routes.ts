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
import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error/error-page.component';
import { MainComponent } from './main/main.component';
import { collectionsRouteResolver } from './routes/collections-route';
import { documentsRouteResolver } from './routes/documents-route';
import { recordTypeMatcher } from './routes/record-type-matcher';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    pathMatch: 'full',
  },
  {
    matcher: recordTypeMatcher('collections'),
    loadChildren: () => import('./routes/collections-route').then((m) => m.collectionsRoutes),
    resolve: { types: collectionsRouteResolver },
    data: {
      adminMode: false,
      detailUrl: '/:viewcode/collections/:pid',
    },
  },
  {
    path: ':viewcode/search/:type',
    loadChildren: () => import('./routes/documents-route').then((m) => m.documentsRoutes),
    resolve: { types: documentsRouteResolver },
    data: {
      showSearchInput: false,
      adminMode: false,
      detailUrl: '/:viewcode/:type/:pid',
    },
  },
  { path: 'errors/:status_code', component: ErrorPageComponent },
  { path: '**', component: ErrorPageComponent },
];
