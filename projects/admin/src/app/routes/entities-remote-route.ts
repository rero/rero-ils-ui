// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { RemoteEntitiesDetailViewComponent } from '../record/detail-view/entities-detail-view/remote/entities-remote-detail-view.component';
import { RemotePageDetailComponent } from '../record/detail-view/entities-detail-view/remote/remote-page-detail/remote-page-detail.component';
import { BaseRoute } from './base-route';

export const entitiesRemoteRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new EntitiesRemoteRoute().getTypes();

export const entitiesRemoteRoutes: Routes = [
  {
    path: 'detail/:pid',
    component: RemotePageDetailComponent,
    title: _('Remote entity'),
  },
];

class EntitiesRemoteRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'remote_entities';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        index: this.name,
        label: _('Remote entities'),
        detailComponent: RemoteEntitiesDetailViewComponent,
      },
    ];
  }
}
