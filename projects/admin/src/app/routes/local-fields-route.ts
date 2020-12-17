/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { EditorComponent, IRoute } from '@rero/ng-core';
import { User } from '@rero/shared';
import { of } from 'rxjs';
import { CanAddLocalFieldsGuard } from '../guard/can-add-local-fields.guard';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { BaseRoute } from './base-route';

export class LocalFieldsRoute extends BaseRoute implements IRoute {

  /** Route name */
  readonly name = 'local_fields';

  /** Record type */
  readonly recordType = 'local_fields';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent, canActivate: [ CanAddLocalFieldsGuard ] }
      ],
      data: {
        adminMode: () => of({
          can: false,
          message: ''
        }),
        types: [
          {
            key: this.name,
            label: 'Local Fields',
            canRead: (record: any) => this.canReadLocalFields(record),
            redirectUrl: (record: any) => this.getUrl(record),
            preCreateRecord: (data: any) => {
              const user: User = this._routeToolService.userService.user;
              if (data.parent == null) {
                data.organisation = {
                  $ref: this._routeToolService.apiService.getRefEndpoint(
                    'organisations',
                    user.currentOrganisation
                  )
                };
                data.parent = {
                  $ref: this._routeToolService.apiService.getRefEndpoint(
                    this._routeToolService.getRouteQueryParam('type'),
                    this._routeToolService.getRouteQueryParam('ref')
                  )
                };
              }
              return data;
            }
          }
        ],
      }
    };
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
      const pidRegExp = new RegExp('.*\/(.*)/(.*)$');
      const regExpResult = pidRegExp.exec(record.metadata.parent.$ref);
      const type = regExpResult[1];
      const pid = regExpResult[2];
      return of(`/records/${type}/detail/${pid}`);
    } else {
      this._routeToolService.router.navigate(['/errors/400'], { skipLocationChange: true });
    }
  }

  /**
   * Check if the item is in the same organisation of connected user.
   * @param record - Object
   * @return Observable
   */
  private canReadLocalFields(record: any) {
    const organisationPid = this._routeToolService.userService.user
      .currentOrganisation;
    const recordOrganisationPid = ('organisation' in record.metadata)
      ? record.metadata.organisation.pid
      : false;
    return of({ can: organisationPid === recordOrganisationPid, message: '' });
  }
}
