// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { PatronTypesBriefViewComponent } from '../record/brief-view/patron-types-brief-view.component';
import { PatronTypesDetailViewComponent } from '../record/detail-view/patron-types-detail-view/patron-types-detail-view.component';
import { BaseRoute } from './base-route';

export const patronTypesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new PatronTypesRoute().getTypes();

export const patronTypesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Patron types'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.PTTY_ACCESS, PERMISSIONS.PTTY_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Patron type'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Patron type'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Patron type'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.PTTY_CREATE],
    },
  },
];

class PatronTypesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'patron_types';

  /** Record type */
  readonly recordType = 'patron_types';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Patron types'),
        component: PatronTypesBriefViewComponent,
        detailComponent: PatronTypesDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.PTTY_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preCreateRecord: (data) => {
          data.organisation = {
            $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
          };
          return data;
        },
        postprocessRecordEditor: (record: any) => {
          // Remove the possible unpaid limit if subscription amount isn't present or if subscription amount <= 0
          if (
            record.subscription_amount &&
            record.subscription_amount <= 0 &&
            record.limits &&
            record.limits.unpaid_subscription
          ) {
            delete record.limits.unpaid_subscription;
          }
          return record;
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
          {
            label: _('Code'),
            value: 'code',
            icon: 'fa fa-sort-alpha-asc',
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }
}
