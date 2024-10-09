/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoldingsApiService {

  private recordService: RecordService = inject(RecordService);

  /** Resource name */
  readonly RESOURCE_NAME = 'holdings';

  /** Items per page */
  readonly ITEMS_PER_PAGE = 10;

  /**
   *
   * @param documentPid - Document pid
   * @param organisationPid - Current organisation pid
   * @param isCurrentOrganisation - Current organisation flag
   * @param page - Page
   * @param itemsPerPage - Item per page
   * @param order - order
   * @returns Observable
   */
  getHoldings(
    documentPid: string,
    organisationPid: string,
    isCurrentOrganisation: boolean = true,
    page: number = 1,
    itemsPerPage: number = 10,
    order: string = 'organisation_library_location'
  ): Observable<any> {
    const query = this._queryOrganisation(documentPid, organisationPid, isCurrentOrganisation);
    return this.recordService.getRecords(
      this.RESOURCE_NAME, query, page, itemsPerPage, undefined, undefined, BaseApi.reroJsonheaders, order).pipe(
      map((result: Record) => result.hits.hits)
    );
  }

  /**
   *
   * @param documentPid - Document pid
   * @param organisationPid - Organisation pid
   * @param isCurrentOrganisation - Is current Organisation
   * @returns Observable
   */
  getHoldingsCount(documentPid: string, organisationPid: string, isCurrentOrganisation: boolean = true): Observable<number> {
    const query = this._queryOrganisation(documentPid, organisationPid, isCurrentOrganisation);
    return this.recordService.getRecords(this.RESOURCE_NAME, query, 1, 1).pipe(
      map((result: Record) => this.recordService.totalHits(result.hits.total))
    );
  }

  /**
   *
   * @param documentPid - Document pid
   * @param organisationPid - Organisation pid
   * @param isCurrentOrganisation - Is current organisation
   * @returns string
   */
  private _queryOrganisation(documentPid: string, organisationPid: string, isCurrentOrganisation: boolean): string {
    return `
      document.pid:${documentPid}
      AND ${isCurrentOrganisation ? '' : 'NOT '}organisation.pid:${organisationPid}
      AND ((holdings_type:standard AND items_count:[1 TO *])
        OR holdings_type:serial OR holdings_type:electronic)`;
  }
}
