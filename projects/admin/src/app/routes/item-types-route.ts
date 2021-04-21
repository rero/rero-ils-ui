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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { RoleGuard } from '../guard/role.guard';
import { ItemTypesBriefViewComponent } from '../record/brief-view/item-types-brief-view.component';
import { ItemTypeDetailViewComponent } from '../record/detail-view/item-type-detail-view/item-type-detail-view.component';
import { BaseRoute } from './base-route';

export class ItemTypesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'item_types';

  /** Record type */
  readonly recordType = 'item_types';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] },
        { path: 'new', component: EditorComponent, canActivate: [RoleGuard], data: { roles: ['system_librarian'] } }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Item types'),
            component: ItemTypesBriefViewComponent,
            detailComponent: ItemTypeDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.user;
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations',
                  user.currentOrganisation
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
