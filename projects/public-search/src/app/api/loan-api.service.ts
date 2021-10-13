/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error, Record, RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanApiService extends BaseApi {

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _httpClient - HttpClient
   */
  constructor(
    private _recordService: RecordService,
    private _httpClient: HttpClient
  ) {
    super();
  }

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
    itemsPerPage: number = 10, headers = BaseApi.reroJsonheaders
  ): Observable<Record | Error> {
    const loanStates = ['ITEM_ON_LOAN'];
    return this._recordService.getRecords(
      'loans', this._patronStateQuery(patronPid, loanStates), page, itemsPerPage,
      undefined, undefined, headers
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
    itemsPerPage: number = 10, headers = BaseApi.reroJsonheaders
  ): Observable<Record | Error> {
    const requestStates = ['PENDING', 'ITEM_AT_DESK', 'ITEM_IN_TRANSIT_FOR_PICKUP'];
    return this._recordService.getRecords(
      'loans', this._patronStateQuery(patronPid, requestStates), page, itemsPerPage,
      undefined, undefined, headers
    );
  }

  /**
   * Is loan can extend
   * @param loanPid - string
   * @returns Observable
   */
  canExtend(loanPid: string): Observable<CanExtend> {
    return this._httpClient.get(`/api/loan/${loanPid}/can_extend`)
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
    return this._httpClient.post('/api/item/extend_loan', data)
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
    return this._httpClient.post('/api/item/cancel_item_request', data)
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
   * Generate patron state query
   * @param patronPid, string
   * @param states, array of state
   * @return string
   */
  private _patronStateQuery(patronPid: string, states: string[]): string {
    return `patron_pid:${patronPid} AND (state:` + states.join(' OR state:') + ')';
  }
}

export interface CanExtend {
  can: boolean;
  reasons: string[];
}
