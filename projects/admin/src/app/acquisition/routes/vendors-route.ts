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
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  RecordData,
  RecordSearchPageComponent,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { permissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { VendorBriefViewComponent } from '../components/vendors/vendor-brief-view.component';
import { VendorDetailViewComponent } from '../components/vendors/vendor-detail-view/vendor-detail-view.component';

export const vendorsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new VendorsRoute().getTypes();

export const vendorsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Vendors'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.VNDR_ACCESS, PERMISSIONS.VNDR_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Vendor'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Vendor'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Vendor'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.VNDR_CREATE],
    },
  },
];

class VendorsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'vendors';
  /** Record type */
  readonly recordType = 'vendors';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Vendors'),
        component: VendorBriefViewComponent,
        detailComponent: VendorDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.VNDR_CREATE), message: '' }),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preCreateRecord: (data: any) => {
          data.organisation = {
            $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
          };
          return data;
        },
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            defaultQuery: true,
            icon: 'fa fa-sort-amount-desc',
          },
          {
            label: _('Name (asc)'),
            value: 'name_asc',
            defaultNoQuery: true,
            icon: 'fa fa-sort-alpha-asc',
          },
          {
            label: _('Name (desc)'),
            value: 'name_desc',
            icon: 'fa fa-sort-alpha-desc',
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }
}
