/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Error, Record, RecordService, RecordUiService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoldingsApiService {

  private recordService = inject(RecordService);
  private recordUiService = inject(RecordUiService);

  /** Resource name */
  readonly RESOURCE_NAME = 'holdings';

  getHoldingsByDocumentPid(documentPid: string): Observable<Record | Error> {
    const query = `document.pid:${documentPid} AND ((holdings_type:standard AND items_count:[1 TO *]) OR holdings_type:serial OR holdings_type:electronic)`;
    return this.recordService.getRecords(
      this.RESOURCE_NAME,
      query,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      BaseApi.reroJsonheaders,
      'organisation_library_location'
    );
  }

  getIssuesByHoldings(holdingsPid: string, page: number, size: number, markedAsNew: boolean, filter?: string) {
    let query = `holding.pid:${holdingsPid} AND NOT type:provisional`;
    if (filter) {
      query += ` AND (enumerationAndChronology.analyzed:"${filter}" OR call_numbers:(*${filter}*) OR barcode:(*${filter}*))`;
    }
    return this.recordService.getRecords('items', query, page, size, [], {}, null,'-issue_sort_date').pipe(
      map((result: Record) => {
        if (markedAsNew) {
          result.hits.hits[0].new_issue = true;
        }
        return result;
      })
    );
  }

  delete(holdingsPid: string): Observable<boolean> {
    return this.recordUiService.deleteRecord(this.RESOURCE_NAME, holdingsPid);
  }

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
    isCurrentOrganisation = true,
    page = 1,
    itemsPerPage = 10,
    order = 'organisation_library_location'
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
  getHoldingsCount(documentPid: string, organisationPid: string, isCurrentOrganisation = true): Observable<number> {
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
