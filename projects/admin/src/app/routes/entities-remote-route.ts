/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { _ } from "@ngx-translate/core";
import { RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { RemoteEntitiesDetailViewComponent } from '../record/detail-view/entities-detail-view/remote/entities-remote-detail-view.component';
import { RemotePageDetailComponent } from '../record/detail-view/entities-detail-view/remote/remote-page-detail/remote-page-detail.component';
import { BaseRoute } from './base-route';

export class EntitiesRemoteRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'remote_entities';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: RemotePageDetailComponent }
      ],
      data: {
        adminMode: () => of({
          can: false,
          message: ''
        }),
        types: [
          {
            key: this.name,
            index: this.name,
            label: _('Remote entities'),
            detailComponent: RemoteEntitiesDetailViewComponent
          }
        ]
      }
    };
  }
}
