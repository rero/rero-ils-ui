/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
