/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { PermissionGuard } from '@app/admin/guard/permission.guard';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RouteInterface } from '@rero/ng-core';
import { PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { of } from 'rxjs';
import {
  PatronTransactionEventsBriefViewComponent
} from '../record/brief-view/patron-transaction-events-brief-view/patron-transaction-events-brief-view.component';
import {
  PatronTransactionEventSearchViewComponent
} from '../record/search-view/patron-transaction-event-search-view/patron-transaction-event-search-view.component';
import { BaseRoute } from './base-route';

export class PatronTransactionEventsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'patron_transaction_events';

  /** Record type */
  readonly recordType = 'patron_transaction_events';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [{
        path: '',
        component: PatronTransactionEventSearchViewComponent,
        canActivate: [ PermissionGuard ],
        data: {
          permissions: [ PERMISSIONS.PTTR_ACCESS, PERMISSIONS.PTTR_SEARCH ],
          operator: PERMISSION_OPERATOR.AND
        }
      }],
      data: {
        adminMode: this.DISABLED,
        types: [
          {
            key: this.name,
            label: _('Fees'),
            component: PatronTransactionEventsBriefViewComponent,
            permissions: (record: any) => this.routeToolService.permissions(record, this.recordType),
            canAdd: (record: any) => of({can: false}),
            canUpdate: (record: any) => of({can: false}),
            canDelete: (record: any) => of({can: false}),
            aggregationsBucketSize: 10,
            aggregationsExpand: [
              'type',
              'category',
              'transaction_date',
              'patron_type',
              'owning_library'
            ],
            aggregationsHide: [
              'total'
            ],
            aggregationsOrder: [
              'total',
              'type',
              'category',
              'transaction_date',
              'patron_type',
              'owning_library',
              'transaction_library'
            ],
            allowEmptySearch: true,
            showSearchInput: false,
            listHeaders: {
              Accept: 'application/rero+json'
            },
            sortOptions: [
              { label: _('Amount (desc)'), value: '-amount' },
              { label: _('Amount (asc)'), value: 'amount' },
              { label: _('Transaction date (desc)'), value: '-created', defaultQuery: true },
              { label: _('Transaction date (asc)'), value: 'created'}
            ],
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
