// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoanOverduePreview } from '@app/admin/classes/loans';
import { ApiService, RecordService } from '@rero/ng-core';
import type { Error, EsResult } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);

  /**
   * Get loan
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param headers - object
   * @return Observable
   */
  getOnLoan(
    patronPid: string, page: number,
    itemsPerPage = 20, headers = BaseApi.reroJsonheaders,
    sort?: string
  ): Observable<EsResult | Error> {
    const loanStates = ['ITEM_ON_LOAN'];
    return this.recordService.getRecords(
      'loans', { query: this._patronStateQuery(patronPid, loanStates), page, itemsPerPage, headers, sort }
    );
  }

  /**
   * Get Request
   * @param patronPid - string
   * @param page - number
   * @param itemsPerPage - number
   * @param withHeaders - boolean
   * @return Observable
   */
  getRequest(
    patronPid: string, page: number,
    itemsPerPage = 10, headers = BaseApi.reroJsonheaders
  ): Observable<EsResult | Error> {
    const requestStates = ['PENDING', 'ITEM_AT_DESK', 'ITEM_IN_TRANSIT_FOR_PICKUP'];
    return this.recordService.getRecords(
      'loans', { query: this._patronStateQuery(patronPid, requestStates), page, itemsPerPage, headers }
    );
  }

  /**
   * Is loan can extend
   * @param loanPid - string
   * @returns Observable
   */
  canExtend(loanPid: string): Observable<CanExtend> {
    return this.httpClient.get(`/api/loan/${loanPid}/can_extend`)
      .pipe(
        catchError(() => of(undefined)),
        map((response: any) => response)
      );
  }

  /**
   * Renew on loan
   * @param data, object
   * @return Observable
   */
  renew(data: { pid: string, item_pid: string, transaction_location_pid: string, transaction_user_pid: string }): Observable<any> {
    return this.httpClient.post('/api/item/extend_loan', data)
      .pipe(
        catchError(() => of(undefined)),
        map((response: any) => {
          return (response !== undefined)
            ? response.action_applied.extend_loan
            : response;
        })
      );
  }

  /**
   * Cancel on loan
   * @param data, object
   * @return Observable
   */
  cancel(data: { pid: string, transaction_location_pid: string, transaction_user_pid: string }): Observable<any> {
    return this.httpClient.post('/api/item/cancel_item_request', data)
      .pipe(
        catchError(() => of(undefined)),
        map((response: any) => {
          return (response !== undefined)
            ? response.action_applied.cancel
            : response;
        })
      );
  }

  /**
   * Get the preview overdue fees related to a specific loan
   * @param loanPid - string: the Loan pid
   * @return Observable of LoanOverduePreview
   */
  getPreviewOverdue(loanPid: string): Observable<LoanOverduePreview> {
    const loanApiUrl = this.apiService.getEndpointByType('loan');
    const url = `${loanApiUrl}/${loanPid}/overdue/preview`;
    return this.httpClient.get<LoanOverduePreview>(url);
  }

  /**
   * Generate patron state query
   * @param patronPid, string
   * @param states, array of state
   * @return string
   */
  private _patronStateQuery(patronPid: string, states: string[]): string {
    return `patron_pid:${patronPid} AND (state:` + states.join(' OR state:') + ')';
  }
}

export type CanExtend = {
  can: boolean;
  reasons: Record<string, string>;
}
