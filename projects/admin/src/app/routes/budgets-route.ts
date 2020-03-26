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
import { CanUpdateGuard } from '../guard/can-update.guard';
import { RoleGuard } from '../guard/role.guard';
import { BudgetsBriefViewComponent } from '../record/brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from '../record/detail-view/budget-detail-view/budget-detail-view.component';
import { BaseRoute } from './base-route';

export class BudgetsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'budgets';

  /** Record type */
  readonly recordType = 'budgets';

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
        { path: 'edit/:pid', component: EditorComponent, canActivate: [ CanUpdateGuard ] },
        { path: 'new', component: EditorComponent, canActivate: [ RoleGuard ], data: { roles: [ 'system_librarian' ]} }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Budgets',
            component: BudgetsBriefViewComponent,
            detailComponent: BudgetDetailViewComponent,
            canAdd: () => this._routeToolService.canSystemLibrarian(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: () => this._routeToolService.canNot(),
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.getCurrentUser();
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                'organisations',
                user.library.organisation.pid
              )};
              return data;
            }
          }
        ]
      }
    };
  }
}
