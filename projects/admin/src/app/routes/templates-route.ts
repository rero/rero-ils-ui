/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { TemplatesBriefViewComponent } from '../record/brief-view/templates-brief-view.component';
import { TemplateDetailViewComponent } from '../record/detail-view/template-detail-view/template-detail-view.component';
import { BaseRoute } from './base-route';

export class TemplatesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'templates';

  /** Record type */
  readonly recordType = 'templates';

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
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Templates',
            component: TemplatesBriefViewComponent,
            detailComponent: TemplateDetailViewComponent,
            canAdd: () => this._routeToolService.canNot(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            aggregationsOrder: [
              'template_type',
              'visibility'
            ],
            aggregationsExpand: ['template_type'],
            // use simple query for UI search
            preFilters: {
              simple: 1
            }
          }
        ]
      }
    };
  }
}
