/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  RecordData,
  RecordSearchPageComponent,
  RecordType,
  RouteDataTypesInterface
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { ItemTypesBriefViewComponent } from '../record/brief-view/item-types-brief-view.component';
import { ItemTypeDetailViewComponent } from '../record/detail-view/item-type-detail-view/item-type-detail-view.component';
import { BaseRoute } from './base-route';

export const itemTypeRouteResolver: ResolveFn<Partial<RecordType>[]> = () => {
  return new ItemTypesRoute().getTypes();
};


export const itemTypesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Item types'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.ITTY_ACCESS, PERMISSIONS.ITTY_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Item type'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Item type'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Item type'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.ITTY_CREATE],
    },
  },
];

class ItemTypesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'item_types';

  /** Record type */
  readonly recordType = 'item_types';

  /**
   * Get Configuration
   * @return Object
   */
  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Item types'),
        component: ItemTypesBriefViewComponent,
        detailComponent: ItemTypeDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.ITTY_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preCreateRecord: (data) => {
          data.organisation = {
            $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
          };
          return data;
        },
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            icon: 'fa fa-sort-amount-desc',
            defaultQuery: true,
          },
          {
            label: _('Name'),
            value: 'name',
            icon: 'fa fa-sort-alpha-asc',
            defaultNoQuery: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }
}
