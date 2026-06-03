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
import { ComponentCanDeactivateGuard, EditorComponent, RecordData, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { canAddLocalFieldsGuard } from '../guard/can-add-local-fields.guard';
import { permissionGuard } from '../guard/permission.guard';
import { BaseRoute } from './base-route';

export const localFieldsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new LocalFieldsRoute().getTypes();

export const localFieldsRoutes: Routes = [
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Local fields'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Local fields'),
    canActivate: [permissionGuard, canAddLocalFieldsGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.LOFI_CREATE],
    },
  },
];

class LocalFieldsRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'local_fields';

  /** Record type */
  readonly recordType = 'local_fields';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: 'Local Fields',
        canRead: (record: RecordData) => this.canReadLocalFields(record),
        redirectUrl: (record: RecordData) => this.getUrl(record),
        preCreateRecord: (data) => {
          if (data.parent == null) {
            data.organisation = {
              $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
            };
            data.parent = {
              $ref: this.routeToolService.apiService.getRefEndpoint(
                this.routeToolService.getRouteQueryParam('type'),
                this.routeToolService.getRouteQueryParam('ref')
              ),
            };
          }
          return data;
        },
      },
    ];
  }

  /**
   * Get the url where redirect the user.
   * After editing an item, user should always redirect to the linked document except if
   * a `redirectTo` parameter is found in the query string
   * @param record - object, record to be saved
   * @return an observable on the url to redirect
   */
  private getUrl(record: any) {
    if ('$ref' in record.metadata.parent) {
      const pidRegExp = new RegExp('.*/(.*)/(.*)$');
      const regExpResult = pidRegExp.exec(record.metadata.parent.$ref);
      const type = regExpResult[1];
      const pid = regExpResult[2];
      return of(`/records/${type}/detail/${pid}`);
    } else {
      this.routeToolService.router.navigate(['/errors/400'], { skipLocationChange: true });
    }
  }

  /**
   * Check if the item is in the same organisation of connected user.
   * @param record - Object
   * @return Observable
   */
  private canReadLocalFields(record: any) {
    const organisationPid = this.routeToolService.appStore.currentOrganisationPid();
    const recordOrganisationPid = 'organisation' in record.metadata ? record.metadata.organisation.pid : false;
    return of({ can: organisationPid === recordOrganisationPid, message: '' });
  }
}
