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
import { CanUpdateGuard } from '../guard/can-update.guard';
import { BaseRoute } from './base-route';

export class AcquisitionAccountsRoute extends BaseRoute implements IRoute {

  /** Route name */
  readonly name = 'acq_accounts';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: 'Acquisition accounts',
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.user;
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations', user.currentOrganisation
                )
              };
              data.library = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'libraries', user.currentLibrary
                )
              };
              data.budget = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'budgets', this._routeToolService.getRouteQueryParam('budget')
                )
              };
              return data;
            },
            redirectUrl: (record: any) => {
              return this.redirectUrl(
                record.metadata.budget,
                '/records/budgets/detail'
              );
            }
          }
        ]
      }
    };
  }
}
