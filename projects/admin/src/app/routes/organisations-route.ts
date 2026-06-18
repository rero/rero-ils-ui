// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { DetailComponent, RecordData, RecordType, RouteDataTypesInterface, ComponentCanDeactivateGuard, EditorComponent } from '@rero/ng-core';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { OrganisationDetailViewComponent } from '../record/detail-view/organisation-detail-view/organisation-detail-view/organisation-detail-view.component';
import { BaseRoute } from './base-route';
import { PERMISSIONS } from '@rero/shared';

export const organisationsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new OrganisationsRoute().getTypes();

export const organisationsRoutes: Routes = [
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Organisation'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
      permissions: [PERMISSIONS.ORG_ACCESS],
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Organisation'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
      permissions: [PERMISSIONS.ORG_ACCESS],
    },
  },
];

class OrganisationsRoute extends BaseRoute implements RouteDataTypesInterface {
  readonly name = 'organisations';
  readonly recordType = 'organisations';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Organisations'),
        editorSettings: {
          longMode: true,
        },
        detailComponent: OrganisationDetailViewComponent,
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
      },
    ];
  }
}
