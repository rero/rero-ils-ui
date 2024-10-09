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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { LoanState } from '../classes/loans';
import { LoansBriefViewComponent } from '../record/brief-view/loans-brief-view/loans-brief-view.component';
import { BaseRoute } from './base-route';

export class LoansRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'loans';

  /** Record type */
  readonly recordType = 'loans';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
      ],
      data: {
        adminMode: this.DISABLED,
        types: [
          {
            key: this.name,
            label: _('Loans'),
            component: LoansBriefViewComponent,
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            canAdd: (record: any) => of({can: false}),
            canUpdate: (record: any) => this.routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this.routeToolService.canDelete(record, this.recordType),
            preFilters: {
              exclude_status: [LoanState.CANCELLED, LoanState.ITEM_RETURNED]
            },
            aggregationsBucketSize: 10,
            aggregationsExpand: [
              'owner_library',
              'transaction_library',
              'pickup_library',
              'misc_status',
              'status'
            ],
            aggregationsOrder: [
              'owner_library',
              'transaction_library',
              'pickup_library',
              'status',
              'misc_status',
              'patron_type',
              'end_date',
              'request_expire_date'
            ],
            allowEmptySearch: true,
            showSearchInput: false,
            listHeaders: {
              Accept: 'application/rero+json'
            },
            exportFormats: [{
              label: 'CSV',
              format: 'csv',
              endpoint: this.routeToolService.apiService.getExportEndpointByType(this.recordType),
              disableMaxRestResultsSize: true,
            }],
            showFacetsIfNoResults: true
          }
        ]
      }
    };
  }
}
