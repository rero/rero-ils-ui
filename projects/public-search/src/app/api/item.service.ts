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
import { map, switchMap } from 'rxjs/operators';
import { HoldingsService } from './holdings.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  /** Http headers */
  private _headers = {
    Accept: 'application/rero+json, application/json'
  };

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _httpClient - HttpClient
   * @param _holdingsService - HoldingsService
   */
  constructor(
    private _recordService: RecordService,
    private _httpClient: HttpClient,
    private _holdingsService: HoldingsService
  ) { }

  /**
   * Get Items total by holdings pid and viewcode
   * @param holdingsPid - string
   * @param viewcode - string
   * @return Observable
   */
  getItemsTotalByHoldingsPidAndViewcode(holdingsPid: string, viewcode: string): Observable<number> {
    return this._recordService
      .getRecords('items', `holding.pid:${holdingsPid}`, 1, 1, undefined, { view: viewcode })
      .pipe(map((items: Record) => this._recordService.totalHits(items.hits.total)));
  }

  /**
   * Get items by holdings pid and viewcode
   * @param holdingsPid - string
   * @param viewcode - string
   * @param page - number
   * @param itemsPerPage - number
   * @return Observable
   */
  getItemsByHoldingsPidAndViewcode(holdingsPid: string, viewcode: string, page: number, itemsPerPage: number = 5): Observable<any[]> {
    return this._recordService
      .getRecords('items', `holding.pid:${holdingsPid}`, page, itemsPerPage, undefined, { view: viewcode }, this._headers)
      .pipe(map((items: Record) => {
        return items.hits.hits;
      }));
  }

  /**
   * Get Items total by document pid and viewcode
   * @param documentPid - string
   * @param viewcode - string
   */
  getItemsTotalByDocumentPidAndViewcode(documentPid: string, viewcode: string): Observable<number> {
    return this.getItemsByDocumentPidAndViewcode(documentPid, viewcode, 1, 1)
    .pipe(map((items: any) => this._recordService.totalHits(items.hits.total)));
  }

  /**
   * Get items by holdings pids and viewcode
   * @param documentPid - string
   * @param viewcode - string
   * @param page - number
   * @param itemsPerPage - number
   * @return Observable
   */
  getItemsByDocumentPidAndViewcode(documentPid: string, viewcode: string, page: number, itemsPerPage: number = 5): Observable<any[]> {
    return this._holdingsService.getHoldingsPidsByDocumentPidAndViewcode(documentPid, viewcode)
    .pipe(
      switchMap((holdingPids: string[]) => {
        return this.getItemsByHoldingsPids(holdingPids, viewcode, page, itemsPerPage);
      })
    );
  }

  /**
   * Get Items by holdings pids
   * @param holdingsPids - array of string
   * @param viewcode - string
   * @param page - number
   * @param itemsPerPage -number
   * @return Observable
   */
  getItemsByHoldingsPids(holdingsPids: string[], viewcode: string, page: number, itemsPerPage: number = 5): Observable<any> {
    const query = 'holding.pid:' + holdingsPids.join(' OR holding.pid:');
    return this._recordService
      .getRecords('items', query, page, itemsPerPage, undefined, { view: viewcode }, this._headers);
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
  request(data: object) {
    return this._httpClient.post('/api/item/request', data);
  }
}
