/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { ActionStatus, Bucket, IFilter, RecordData, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { map, Observable, of } from 'rxjs';
import { permissionGuard } from '../guard/permission.guard';
import {
  PatronTransactionEventsBriefViewComponent,
} from '../record/brief-view/patron-transaction-events-brief-view/patron-transaction-events-brief-view.component';
import {
  PatronTransactionEventSearchViewComponent,
} from '../record/search-view/patron-transaction-event-search-view/patron-transaction-event-search-view.component';
import { BaseRoute } from './base-route';
import { LibraryApiService } from '../api/library-api.service';
import { inject } from '@angular/core';

export const patronTransactionEventsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new PatronTransactionEventsRoute().getTypes();

export const patronTransactionEventsRoutes: Routes = [
  {
    path: '',
    component: PatronTransactionEventSearchViewComponent,
    title: _('Fees'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.PTTR_ACCESS, PERMISSIONS.PTTR_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
];

class PatronTransactionEventsRoute extends BaseRoute implements RouteDataTypesInterface {
  protected libraryApiService = inject(LibraryApiService);
  /** Route name */
  readonly name = 'patron_transaction_events';

  /** Record type */
  readonly recordType = 'patron_transaction_events';

  /**
 * Process bucket or filter name.
 *
 * @param bucketOrFilter Bucket or filter.
 * @return Observable of the name.
 */
  private processName(bucketOrFilter: Bucket | IFilter): Observable<string> {
    switch (bucketOrFilter.aggregationKey) {
      case 'owning_library':
      case 'transaction_library': return this.libraryApiService.getByPid(bucketOrFilter.key).pipe(map(record => record.name));
      default: return bucketOrFilter.name ? of(bucketOrFilter.name) : this.routeToolService.translateService.stream(bucketOrFilter.key);
    }
  }

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Fees'),
        component: PatronTransactionEventsBriefViewComponent,
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        processBucketName: (bucket: Bucket) => this.processName(bucket),
        processFilterName: (filter: IFilter) => this.processName(filter),
        canAdd: () => of({ can: false } as ActionStatus),
        canUpdate: (_record: RecordData) => of({ can: false } as ActionStatus),
        canDelete: (_record: RecordData) => of({ can: false } as ActionStatus),
        aggregationsBucketSize: 10,
        aggregationsExpand: ['type', 'category', 'transaction_date', 'patron_type', 'owning_library'],
        aggregationsHide: ['total'],
        aggregationsOrder: [
          'total',
          'type',
          'category',
          'transaction_date',
          'patron_type',
          'owning_library',
          'transaction_library',
        ],
        allowEmptySearch: true,
        listHeaders: {
          Accept: 'application/rero+json',
        },
        sortOptions: [
          { label: _('Amount (desc)'), value: '-amount' },
          { label: _('Amount (asc)'), value: 'amount' },
          { label: _('Transaction date (desc)'), value: '-created', defaultQuery: true },
          { label: _('Transaction date (asc)'), value: 'created' },
        ],
        exportFormats: [
          {
            label: 'CSV',
            format: 'csv',
            endpoint: this.routeToolService.apiService.getExportEndpointByType(this.recordType),
            disableMaxRestResultsSize: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }
}
