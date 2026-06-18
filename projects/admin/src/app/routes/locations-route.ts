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
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { libraryGuard } from '../guard/library.guard';
import { permissionGuard } from '../guard/permission.guard';
import { LocationDetailViewComponent } from '../record/detail-view/location-detail-view/location-detail-view.component';
import { BaseRoute } from './base-route';

export const locationsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new LocationsRoute().getTypes();

export const locationsRoutes: Routes = [
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Location'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Location'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Location'),
    canActivate: [permissionGuard, libraryGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.LOC_CREATE],
    },
  },
];

class LocationsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'locations';

  /** Record type */
  readonly recordType = 'locations';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Locations'),
        detailComponent: LocationDetailViewComponent,
        canAdd: () =>
          of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.LOC_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        preprocessRecordEditor: (record: any) => {
          // Location resource use a asynchronous validator ('valueAlreadyExists').
          // This validator needs the library pid to work ; but in creation mode, the record.library.pid isn't yet known by system
          // so we use the 'library' query parameter to construct this data (only if the resource isn't already related to a library)
          if (record.library == null && this.routeToolService.getRouteQueryParam('library') != null) {
            record.library = {
              $ref: this.routeToolService.apiService.getRefEndpoint(
                'libraries',
                this.routeToolService.getRouteQueryParam('library')
              ),
            };
          }
          return record;
        },
        postprocessRecordEditor: (record: any) => {
          if (!record.allow_request || !record.send_notification) {
            delete record.send_notification;
            delete record.notification_email;
          }
          return record;
        },
        redirectUrl: (record: RecordData) => {
          return this.redirectUrl(record.metadata.library, '/records/libraries/detail');
        },
      },
    ];
  }
}
