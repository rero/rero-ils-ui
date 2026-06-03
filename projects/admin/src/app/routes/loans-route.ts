/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { ActionStatus, Bucket, IFilter, RecordData, RecordSearchPageComponent, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { map, Observable, of } from 'rxjs';
import { LibraryApiService } from '../api/library-api.service';
import { LoanState } from '../classes/loans';
import { LoansBriefViewComponent } from '../record/brief-view/loans-brief-view/loans-brief-view.component';
import { BaseRoute } from './base-route';

export const loansRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new LoansRoute().getTypes();

export const loansRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Current loans'),
  },
];

class LoansRoute extends BaseRoute implements RouteDataTypesInterface {
  protected libraryApiService = inject(LibraryApiService);
  /** Route name */
  readonly name = 'loans';

  /** Record type */
  readonly recordType = 'loans';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Loans'),
        component: LoansBriefViewComponent,
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        processBucketName: (bucket: Bucket) => this.processName(bucket),
        processFilterName: (filter: IFilter) => this.processName(filter),
        canAdd: () => of({ can: false } as ActionStatus),
        canUpdate: (record: RecordData) => this.routeToolService.canUpdate(record, this.recordType),
        canDelete: (record: RecordData) => this.routeToolService.canDelete(record, this.recordType),
        preFilters: {
          exclude_status: [LoanState.CANCELLED, LoanState.ITEM_RETURNED],
        },
        aggregationsBucketSize: 10,
        aggregationsExpand: ['owner_library', 'transaction_library', 'pickup_library', 'misc_status', 'status'],
        aggregationsOrder: [
          'owner_library',
          'transaction_library',
          'pickup_library',
          'status',
          'misc_status',
          'patron_type',
          'end_date',
          'request_expire_date',
        ],
        allowEmptySearch: true,
        listHeaders: {
          Accept: 'application/rero+json',
        },
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

  /**
   * Process bucket or filter name.
   *
   * @param bucketOrFilter Bucket or filter.
   * @return Observable of the name.
   */
  private processName(bucketOrFilter: Bucket | IFilter): Observable<string> {
    if(bucketOrFilter.name) { return of(bucketOrFilter.name); }
    switch (bucketOrFilter.aggregationKey) {
      case 'owner_library':
      case 'pickup_library':
      case 'transaction_library': return this.libraryApiService.getByPid(bucketOrFilter.key).pipe(map(record => record.name));
      default: return bucketOrFilter.name ? of(bucketOrFilter.name) : this.routeToolService.translateService.stream(bucketOrFilter.key);
    }
  }
}
