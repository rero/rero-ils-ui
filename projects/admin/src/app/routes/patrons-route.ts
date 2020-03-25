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
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view.component';
import { PatronDetailViewComponent } from '../record/detail-view/patron-detail-view/patron-detail-view.component';
import { BaseRoute } from './base-route';

export class PatronsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'patrons';

  /** Record type */
  readonly recordType = 'patrons';

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
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Patrons',
            component: PatronsBriefViewComponent,
            detailComponent: PatronDetailViewComponent,
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            aggregationsExpand: ['roles'],
            // Clean-up 'blocked_note' field content if blocked is false.
            postprocessRecordEditor: (record: any) => {
              if (record.blocked === false) {
                delete record.blocked_note;
              }
              return record;
            },
          }
        ]
      }
    };
  }
}
