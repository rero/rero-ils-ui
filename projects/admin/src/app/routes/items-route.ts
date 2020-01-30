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
import { BaseRoute } from './Base-route';
import { RouteInterface, DetailComponent, EditorComponent } from '@rero/ng-core';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { of } from 'rxjs';

export class ItemsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'items';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Items',
            detailComponent: ItemDetailViewComponent,
            canRead: (record: any) => this.canReadItem(record),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record),
            canDelete: (record: any) => this._routeToolService.canDelete(record),
            preCreateRecord: (data: any) => {
              data.document = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'documents',
                  this._routeToolService.getRouteQueryParam('document')
                )
              };
              // remove dynamic field
              if (data.hasOwnProperty('available')) {
                delete data.available;
              }
              return data;
            }
          }
        ]
      }
    };
  }

  private canReadItem(record: any) {
    const organisationPid = this._routeToolService.userService
      .getCurrentUser().library.organisation.pid;
    if ('organisation' in record.metadata) {
      return of({
        can: organisationPid === record.metadata.organisation.pid,
        message: ''
      });
    }
    return of({ can: false, message: '' });
  }
}
