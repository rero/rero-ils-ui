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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { EditorComponent, RouteInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '../guard/can-access.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { EntitiesLocalDetailViewComponent } from '../record/detail-view/entities-detail-view/local/entities-local-detail-view.component';
import { LocalPageDetailComponent } from '../record/detail-view/entities-detail-view/local/local-page-detail/local-page-detail.component';
import { BaseRoute } from './base-route';

export class EntitiesLocalRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'local_entities';

  /** Record type */
  recordType = 'local_entities';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: LocalPageDetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.LOCENT_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            index: this.name,
            label: _('Local entities'),
            detailComponent: EntitiesLocalDetailViewComponent,
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            redirectUrl: (record: any, action: string) => action === 'delete'
              ? of('/records/entities')
              : of(`/records/${this.recordType}/detail/${record.metadata.pid}`)
          }
        ]
      }
    };
  }
}
