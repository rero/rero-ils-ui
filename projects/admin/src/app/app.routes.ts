// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { PERMISSIONS } from '@rero/shared';
import { recordTypeMatcher } from './routes/record-type-matcher';
import { ErrorPageComponent } from './error/error-page/error-page.component';
import { permissionGuard } from './guard/permission.guard';
import { PermissionDetailViewComponent } from './record/detail-view/permission-detail-view/permission-detail-view.component';
import { circulationPoliciesRouteResolver } from './routes/circulation-policies-route';
import { collectionsRouteResolver } from './routes/collections-route';
import { documentsRouteResolver } from './routes/documents-route';
import { entitiesLocalRouteResolver } from './routes/entities-local-route';
import { entitiesRemoteRouteResolver } from './routes/entities-remote-route';
import { entitiesRouteResolver } from './routes/entities-route';
import { holdingsRouteResolver } from './routes/holdings-route';
import { illRequestsRouteResolver } from './routes/ill-requests-route';
import { importDocumentsRouteResolver } from './routes/import-documents-route';
import { issuesRouteResolver } from './routes/issues-route';
import { itemTypeRouteResolver } from './routes/item-types-route';
import { itemsRouteResolver } from './routes/items-route';
import { librariesRouteResolver } from './routes/libraries-route';
import { loansRouteResolver } from './routes/loans-route';
import { localFieldsRouteResolver } from './routes/local-fields-route';
import { locationsRouteResolver } from './routes/locations-route';
import { patronTransactionEventsRouteResolver } from './routes/patron-transaction-events-route';
import { patronTypesRouteResolver } from './routes/patron-types-route';
import { patronsRouteResolver } from './routes/patrons-route';
import { statisticsCfgRouteResolver } from './routes/statistics-cfg-route';
import { templatesRouteResolver } from './routes/templates-route';
import { FrontpageComponent } from './widgets/frontpage/frontpage.component';
import { organisationsRouteResolver } from './routes/organisations-route';

export const routes: Routes = [
  {
    path: 'migrations',
    loadChildren: () => import('./migration/migration.routes').then((m) => m.MIGRATION_ROUTES),
  },
  {
    path: '',
    component: FrontpageComponent,
    title: _('Home'),
  },
  {
    matcher: recordTypeMatcher('item_types'),
    loadChildren: () => import('./routes/item-types-route').then((m) => m.itemTypesRoutes),
    resolve: { types: itemTypeRouteResolver },
  },
  {
    matcher: recordTypeMatcher('patron_types'),
    loadChildren: () => import('./routes/patron-types-route').then((m) => m.patronTypesRoutes),
    resolve: { types: patronTypesRouteResolver },
  },
  {
    matcher: recordTypeMatcher('circ_policies'),
    loadChildren: () => import('./routes/circulation-policies-route').then((m) => m.circulationPoliciesRoutes),
    resolve: { types: circulationPoliciesRouteResolver },
  },
  {
    matcher: recordTypeMatcher('libraries'),
    loadChildren: () => import('./routes/libraries-route').then((m) => m.librariesRoutes),
    resolve: { types: librariesRouteResolver },
  },
  {
    matcher: recordTypeMatcher('ill_requests'),
    loadChildren: () => import('./routes/ill-requests-route').then((m) => m.illRequestsRoutes),
    resolve: { types: illRequestsRouteResolver },
    data: { linkPrefix: 'records' },
  },
  {
    matcher: recordTypeMatcher('stats_cfg'),
    loadChildren: () => import('./routes/statistics-cfg-route').then((m) => m.statisticsCfgRoutes),
    resolve: { types: statisticsCfgRouteResolver },
  },
  {
    matcher: recordTypeMatcher('collections'),
    loadChildren: () => import('./routes/collections-route').then((m) => m.collectionsRoutes),
    resolve: { types: collectionsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('patrons'),
    loadChildren: () => import('./routes/patrons-route').then((m) => m.patronsRoutes),
    resolve: { types: patronsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('templates'),
    loadChildren: () => import('./routes/templates-route').then((m) => m.templatesRoutes),
    resolve: { types: templatesRouteResolver },
  },
  {
    matcher: recordTypeMatcher('issues'),
    loadChildren: () => import('./routes/issues-route').then((m) => m.issuesRoutes),
    resolve: { types: issuesRouteResolver },
    data: { adminMode: false, detailUrl: '/records/items/detail/:pid' },
  },
  {
    matcher: recordTypeMatcher('loans'),
    loadChildren: () => import('./routes/loans-route').then((m) => m.loansRoutes),
    resolve: { types: loansRouteResolver },
    data: {
      showSearchInput: false,
      adminMode: false,
    },
  },
  {
    matcher: recordTypeMatcher('patron_transaction_events'),
    loadChildren: () => import('./routes/patron-transaction-events-route').then((m) => m.patronTransactionEventsRoutes),
    resolve: { types: patronTransactionEventsRouteResolver },
    data: {
      showSearchInput: false,
      adminMode: false,
    },
  },
  {
    matcher: recordTypeMatcher('entities'),
    loadChildren: () => import('./routes/entities-route').then((m) => m.entitiesRoutes),
    resolve: { types: entitiesRouteResolver },
  },
  {
    matcher: recordTypeMatcher('holdings'),
    loadChildren: () => import('./routes/holdings-route').then((m) => m.holdingsRoutes),
    resolve: { types: holdingsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('locations'),
    loadChildren: () => import('./routes/locations-route').then((m) => m.locationsRoutes),
    resolve: { types: locationsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('local_entities'),
    loadChildren: () => import('./routes/entities-local-route').then((m) => m.entitiesLocalRoutes),
    resolve: { types: entitiesLocalRouteResolver },
  },
  {
    matcher: recordTypeMatcher('remote_entities'),
    loadChildren: () => import('./routes/entities-remote-route').then((m) => m.entitiesRemoteRoutes),
    resolve: { types: entitiesRemoteRouteResolver },
    data: { adminMode: false },
  },
  {
    matcher: recordTypeMatcher('local_fields'),
    loadChildren: () => import('./routes/local-fields-route').then((m) => m.localFieldsRoutes),
    resolve: { types: localFieldsRouteResolver },
    data: { adminMode: false },
  },
  {
    matcher: recordTypeMatcher('documents'),
    loadChildren: () => import('./routes/documents-route').then((m) => m.documentsRoutes),
    resolve: { types: documentsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('items'),
    loadChildren: () => import('./routes/items-route').then((m) => m.itemsRoutes),
    resolve: { types: itemsRouteResolver },
  },
  {
    matcher: recordTypeMatcher('organisations'),
    loadChildren: () => import('./routes/organisations-route').then((m) => m.organisationsRoutes),
    resolve: { types: organisationsRouteResolver },
  },
  {
    // must be after all specific records/ routes — matches external import sources (e.g. records/bnf)
    path: 'records/:type',
    loadChildren: () => import('./routes/import-documents-route').then((m) => m.importDocumentsRoutes),
    resolve: { types: importDocumentsRouteResolver },
  },
  {
    path: 'circulation',
    loadChildren: () => import('./circulation/circulation.routes').then((m) => m.circulationRoutes),
  },
  {
    path: 'acquisition',
    loadChildren: () => import('./acquisition/acquisition.routes').then((m) => m.acquisitionsRoutes),
  },
  {
    path: 'permissions/matrix',
    component: PermissionDetailViewComponent,
    title: _('Permissions matrix'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.PERM_MANAGEMENT],
    },
  },
  {
    path: 'errors/:status_code',
    component: ErrorPageComponent,
    title: _('Error'),
  },
  {
    path: '**',
    component: ErrorPageComponent,
    title: _('Error'),
  },
];
