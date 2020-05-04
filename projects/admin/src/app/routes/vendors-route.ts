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
import { DetailComponent, EditorComponent, RecordSearchComponent, RouteInterface } from '@rero/ng-core';
import { VendorBriefViewComponent } from '../record/brief-view/vendor-brief-view.component';
import { VendorDetailViewComponent } from '../record/detail-view/vendor-detail-view/vendor-detail-view.component';
import { BaseRoute } from './base-route';

export class VendorsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'vendors';

  /** Record type */
  readonly recordType = 'persons';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Vendors',
            component: VendorBriefViewComponent,
            detailComponent: VendorDetailViewComponent,
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            // use simple query for UI search
            preFilters: {
              simple: 1
            },
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.getCurrentUser();
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.library.organisation.pid
                )
              };
              return data;
            }
          }
        ]
      }
    };
  }
}
