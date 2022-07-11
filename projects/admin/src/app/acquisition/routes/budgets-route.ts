/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { DetailComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { BaseRoute } from 'projects/admin/src/app/routes/base-route';
import { BudgetsBriefViewComponent } from '../components/budget/budget-brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from '../components/budget/budget-detail-view/budget-detail-view.component';

export class BudgetsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'budgets';
  /** Record type */
  readonly recordType = 'budgets';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent }
      ],
      data: {
        adminMode: this.DISABLED,
        types: [
          {
            key: this.name,
            label: _('Budgets'),
            component: BudgetsBriefViewComponent,
            detailComponent: BudgetDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ]
          }
        ]
      }
    };
  }
}
