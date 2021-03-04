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
import { Record, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IssueItemStatus } from '../../../../admin/src/app/class/items';
import { QueryResponse } from '../record';
import { HoldingsApiService } from './holdings-api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {

  /** Http headers */
  private _headers = {
    Accept: 'application/rero+json, application/json'
  };

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _httpClient - HttpClient
   * @param _holdingsApiService - HoldingsService
   */
  constructor(
    private _recordService: RecordService,
    private _httpClient: HttpClient,
    private _holdingsApiService: HoldingsApiService
  ) { }

  /**
   * Get items by holdings pid and viewcode
   * @param holdings - any: the holding to search
   * @param viewcode - string: the view to filter
   * @param page - number: page number
   * @param itemsPerPage - number: number of item to return
   * @return Observable<QueryResponse>
   */
  getItemsByHoldingsAndViewcode(
    holdings: any, viewcode: string, page: number, itemsPerPage: number = 5): Observable<QueryResponse> {
    const sort = (holdings.metadata.holdings_type === 'serial')
      ? '-issue_expected_date'
      : 'enumeration_chronology';
    console.log(sort);
    const query = (holdings.metadata.holdings_type === 'serial')
      ? `holding.pid:${holdings.metadata.pid} AND issue.status:${IssueItemStatus.RECEIVED}`
      : `holding.pid:${holdings.metadata.pid}`;
    return this._recordService
      .getRecords('items', query, page, itemsPerPage, undefined, { view: viewcode }, this._headers, sort)
      .pipe(map((response: Record) => response.hits));
  }

  /**
   * Item Can request
   * @param itemPid - string
   * @param patronBarcode - string
   * @return Observable
   */
  canRequest(itemPid: string, patronBarcode: string): Observable<any> {
    return this._httpClient.get<any>(`/api/item/${itemPid}/can_request?patron_barcode=${patronBarcode}`);
  }

  /**
   * Item request
   * @param data - Object
   * @return Obserable
   */
  request(data: object): Observable<any> {
    return this._httpClient.post('/api/item/request', data);
  }
}
