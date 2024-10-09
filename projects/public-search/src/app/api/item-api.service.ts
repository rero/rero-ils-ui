/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { BaseApi, IAvailability, IAvailabilityService, IssueItemStatus } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryResponse } from '../record';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService extends BaseApi implements IAvailabilityService {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);

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
      ? '-issue_sort_date'
      : 'enumeration_chronology';
    const query = (holdings.metadata.holdings_type === 'serial')
      ? `holding.pid:${holdings.metadata.pid} AND issue.status:${IssueItemStatus.RECEIVED}`
      : `holding.pid:${holdings.metadata.pid}`;
    return this.recordService
      .getRecords('items', query, page, itemsPerPage, undefined, { view: viewcode }, BaseApi.reroJsonheaders, sort)
      .pipe(map((response: Record) => response.hits));
  }

  /**
   * Item Can request
   * @param itemPid - string
   * @param libraryPid - string
   * @param patronBarcode - string
   * @return Observable
   */
  canRequest(itemPid: string, libraryPid: string, patronBarcode: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.appConfigService.apiEndpointPrefix}/item/${itemPid}/can_request?library_pid=${libraryPid}&patron_barcode=${patronBarcode}`
      );
  }

  /**
   * Item request
   * @param data - Object
   * @return Observable
   */
  request(data: { item_pid: string, pickup_location_pid: string }): Observable<any> {
    return this.httpClient.post(`${this.appConfigService.apiEndpointPrefix}/item/patron_request`, data);
  }

  /**
   * Get availability by item pid
   * @param pid - item pid
   * @returns Observable of availability data
   */
  getAvailability(pid: string): Observable<IAvailability> {
    const url = `${this.appConfigService.apiEndpointPrefix}/item/${pid}/availability?more_info=1`;
    return this.httpClient.get<IAvailability>(url);
  }
}
