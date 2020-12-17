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
import { IRoute, RecordSearchPageComponent } from '@rero/ng-core';
import { of } from 'rxjs';
import { IssueItemStatus } from '../class/items';
import { IssuesBriefViewComponent } from '../record/brief-view/issues-brief-view/issues-brief-view.component';
import { BaseRoute } from './base-route';

export class IssuesRoute extends BaseRoute implements IRoute {

  /** Route name */
  readonly name = 'issues';

  /** Record type */
  readonly recordType = 'items';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent }
      ],
      data: {
        adminMode: () => of({
          can: false,
          message: ''
        }),
        detailUrl: '/records/items/detail/:pid',
        types: [
          {
            key: this.name,
            label: 'Issues',
            index: 'items',
            component: IssuesBriefViewComponent,
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
            // use simple query for UI search
            preFilters: {
                simple: 1,
                or_issue_status: [IssueItemStatus.LATE, IssueItemStatus.CLAIMED]
              },
            aggregationsBucketSize: 10,
            aggregationsOrder: [
              'library',
              'location',
              'item_type',
              'vendor',
              'issue_status'
            ],
            aggregationsExpand: ['library', 'issue_status'],
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            exportFormats: [
              {
                label: 'CSV',
                format: 'csv'
              }
            ],
          }
        ],
      }
    };
  }
}
