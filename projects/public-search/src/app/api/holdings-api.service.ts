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
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { BaseApi, IAvailability, IAvailabilityService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HoldingCanRequest, HoldingPatronRequest } from '../classes/holdings';
import { QueryResponse } from '../record';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class HoldingsApiService extends BaseApi implements IAvailabilityService {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);

  /**
   * Get Holdings by document pid and viewcode
   * @param documentPid - string
   * @param viewcode - string
   * @return Observable
   */
  getHoldingsByDocumentPidAndViewcode(
    documentPid: string, viewcode: string, page: number, itemsPerPage: number = 5): Observable<QueryResponse> {
    const query = `document.pid:${documentPid}
    AND ((holdings_type:standard AND public_items_count:[1 TO *]) OR holdings_type:serial)`;
    return this.recordService
    .getRecords(
      'holdings', query, page, itemsPerPage, undefined, { view: viewcode },
      BaseApi.reroJsonheaders, 'organisation_library_location'
    ).pipe(map((response: Record) => response.hits));
  }

  /**
   * Holding Can request
   * @param holdingPid - Holding pid
   * @param libraryPid - Library pid
   * @param patronBarcode - Patron Barcode
   * @return Observable - Check holding can be requested
   */
  canRequest(holdingPid: string, libraryPid: string, patronBarcode: string): Observable<HoldingCanRequest> {
    const url = `${this.appConfigService.apiEndpointPrefix}/holding/${holdingPid}/can_request`;
    const params = new HttpParams()
      .set('library_pid', libraryPid)
      .set('patron_barcode', patronBarcode);
    return this.httpClient.get<HoldingCanRequest>(url, { params });
  }

  /**
   * Holding patron request
   * @param data - Holding pid, pickup location pid, description
   * @return Observable - Create provisional item
   */
  request(data: { holding_pid: string, pickup_location_pid: string, description: string }): Observable<HoldingPatronRequest> {
    const url = `${this.appConfigService.apiEndpointPrefix}/holding/patron_request`;
    return this.httpClient.post<HoldingPatronRequest>(url, data);
  }

  /**
   * Get availability by holding pid
   * @param pid - holding pid
   * @returns Observable of availability data
   */
  getAvailability(pid: string): Observable<IAvailability> {
    const url = `${this.appConfigService.apiEndpointPrefix}/holding/${pid}/availability`;
    return this.httpClient.get<IAvailability>(url);
  }
}
