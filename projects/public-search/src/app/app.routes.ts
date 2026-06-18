// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
