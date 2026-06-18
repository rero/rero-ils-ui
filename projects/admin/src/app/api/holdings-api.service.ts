// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import type { EsResult } from '@rero/ng-core';
import { Error, RecordService, RecordUiService } from '@rero/ng-core';
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

  getHoldingsByDocumentPid(documentPid: string): Observable<EsResult | Error> {
    const query = `document.pid:${documentPid} AND ((holdings_type:standard AND items_count:[1 TO *]) OR holdings_type:serial OR holdings_type:electronic)`;
    return this.recordService.getRecords(
      this.RESOURCE_NAME,
      { query, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, headers: BaseApi.reroJsonheaders, sort: 'organisation_library_location' }
    );
  }

  getIssuesByHoldings(holdingsPid: string, page: number, size: number, markedAsNew: boolean, filter?: string) {
    let query = `holding.pid:${holdingsPid} AND NOT type:provisional`;
    if (filter) {
      query += ` AND (enumerationAndChronology.analyzed:"${filter}" OR call_numbers:(*${filter}*) OR barcode:(*${filter}*))`;
    }
    return this.recordService.getRecords('items', { query, page, itemsPerPage: size, aggregationsFilters: [], preFilters: {}, sort: '-issue_sort_date' }).pipe(
      map((result: EsResult) => {
        if (markedAsNew) {
          (result.hits.hits[0] as any).new_issue = true;
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
      this.RESOURCE_NAME, { query, page, itemsPerPage, headers: BaseApi.reroJsonheaders, sort: order }).pipe(
      map((result: EsResult) => result.hits.hits)
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
    return this.recordService.getRecords(this.RESOURCE_NAME, { query, page: 1, itemsPerPage: 1 }).pipe(
      map((result: EsResult) => +this.recordService.totalHits(result.hits.total))
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
