/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from '@app/admin/guard/can-access.guard';
import { LibraryGuard } from '@app/admin/guard/library.guard';
import { PermissionGuard } from '@app/admin/guard/permission.guard';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { EntityBriefViewComponent, PERMISSIONS } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { ContributionDetailViewComponent } from '../record/detail-view/contribution-detail-view/contribution-detail-view.component';
import { BaseRoute } from './base-route';

export class EntitiesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'entities';
  /** Record type */
  readonly recordType = 'local_entities';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.READ } },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanAccessGuard ], data: { action: CAN_ACCESS_ACTIONS.UPDATE } },
        { path: 'new', component: EditorComponent, canActivate: [ PermissionGuard, LibraryGuard ], data: { permissions: [ PERMISSIONS.LOCENT_CREATE ] } }
      ],
      data: {
        types: [
          {
            key: 'entities',
            index: 'entities',
            label: _('Entities'),
            component: EntityBriefViewComponent,
            detailComponent: ContributionDetailViewComponent,
            canAdd: () => of({
              can: this._routeToolService.permissionsService.canAccess(PERMISSIONS.LOCENT_CREATE),
              url: ['/records', this.recordType, 'new']
            }),
            permissions: (record: any) => (record.metadata.resource_type === 'remote')
              ? of({})  // No actions are available on remote managed entities
              : this._routeToolService.permissions(record, this.recordType),
            aggregations: (aggregations: any) => this._routeToolService.aggregationFilter(aggregations),
            aggregationsName: {
              resource_type: _('Source'),
              type: _('Type'),
              source_catalog: _('Source catalog'),
            },
            showFacetsIfNoResults: false,
            allowEmptySearch: true,
            aggregationsOrder: [
              'resource_type',
              'type',
              'source_catalog'
            ],
            aggregationsExpand: [
              'resource_type',
              'type',
              'source_catalog'
            ],
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
          }
        ]
      }
    };
  }
}
