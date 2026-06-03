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
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  IFilter,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { map, Observable, of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { IllRequestsBriefViewComponent } from '../record/brief-view/ill-requests-brief-view/ill-requests-brief-view.component';
import { IllRequestDetailViewComponent } from '../record/detail-view/ill-request-detail-view/ill-request-detail-view.component';
import { BaseRoute } from './base-route';

export const illRequestsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new IllRequestsRoute().getTypes();

export const illRequestsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('ILL requests'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.ILL_ACCESS, PERMISSIONS.ILL_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('ILL request'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('ILL request'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('ILL request'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.ILL_CREATE],
    },
  },
];

class IllRequestsRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'ill_requests';

  /** Record type */
  readonly recordType = 'ill_requests';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: 'ILL request',
        component: IllRequestsBriefViewComponent,
        detailComponent: IllRequestDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.ILL_CREATE) } as ActionStatus),
        canUpdate: (record: RecordData) => this.routeToolService.canUpdate(record, this.recordType),
        canDelete: (record: RecordData) => this.routeToolService.canDelete(record, this.recordType),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
        aggregationsExpand: ['request_status', 'loan_status', 'requester'],
        aggregationsOrder: ['request_status', 'loan_status', 'requester', 'library'],
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        showFacetsIfNoResults: true,
      },
    ];
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
