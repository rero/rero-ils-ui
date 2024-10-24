/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { IssueItemStatus, PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import { PermissionGuard } from '../guard/permission.guard';
import { IssuesBriefViewComponent } from '../record/brief-view/issues-brief-view/issues-brief-view.component';
import { BaseRoute } from './base-route';

export class IssuesRoute extends BaseRoute implements RouteInterface {

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
        { path: '', component: RecordSearchPageComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ISSUE_MANAGEMENT ] } }
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
            searchFilters: [
              this.expertSearchFilter()
            ],
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            preFilters: {
                or_issue_status: [IssueItemStatus.LATE]
              },
            aggregationsBucketSize: 10,
            aggregationsOrder: [
              'library',
              'location',
              'item_type',
              'vendor',
              'claims_count',
              'claims_date'
            ],
            aggregationsExpand: ['library'],
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            exportFormats: [
              {
                label: 'CSV',
                format: 'csv',
                endpoint: this.routeToolService.apiService.getEndpointByType('item/inventory'),
                disableMaxRestResultsSize: true,
              }
            ],
            showFacetsIfNoResults: true
          }
        ],
      }
    };
  }
}
