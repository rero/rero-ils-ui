/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService, Error, RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from '../service/app-config.service';
import { ITypeEmail } from '../shared/preview-email/IPreviewInterface';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {

  // SERVICE ATTRIBUTES =======================================================
  /** resource name */
  static readonly RESOURCE_NAME = 'items';

  /** http client options */
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _appConfigService: AppConfigService
   * @param _apiService - ApiService
   * @param _recordService - RecordService
   * @param _http - HttpClient
   */
  constructor(
    private _appConfigService: AppConfigService,
    private _apiService: ApiService,
    private _recordService: RecordService,
    private _http: HttpClient
  ){ }

  // SERVICE FUNCTIONS ========================================================
  /**
   * Get an Item through the REST-API
   * @param pid: the item pid
   * @param resolve: if $ref should be resolved.
   * @returns: an `Observable` on REST-API item metadata result
   */
  getItem(pid: string, resolve: boolean = false): Observable<any> {
    return this._recordService
      .getRecord(ItemApiService.RESOURCE_NAME, pid, resolve ? 1 : 0)
      .pipe(
        map((result: any) => result.metadata)
      );
  }

  /**
   * Allow to update the owning location of an item.
   * @param item: the item object to update
   * @param newLocationPid: the new owning location pid
   */
  updateLocation(item: any, newLocationPid: string): Observable<Object | Error> {
    item.location.$ref = this._apiService.getRefEndpoint('locations', newLocationPid);
    return this._recordService.update(ItemApiService.RESOURCE_NAME, item.pid, item);
  }

  /**
   * Get stats of the item
   * @param itemPid - The item pid
   * @returns Observable of the stats of item
   */
  getStatsByItemPid(itemPid: string): Observable<any> {
    return this._http.get<any>(`${this._appConfigService.apiEndpointPrefix}/item/${itemPid}/stats`);
  }

  /**
   * Get Preview by item pid
   * @param itemPid - The pid of the current item
   * @returns Observable of the Preview of a claim and suggested email addresses.
   */
  getPreviewByItemPid(itemPid: string): Observable<any> {
    return this._http.get<any>(
      `${this._appConfigService.apiEndpointPrefix}/item/${itemPid}/issue/claims/preview`,
      this._httpOptions
    ).pipe(catchError((err: any) => of({ error: err.error.message })));
  }

  /**
   * Add a new claim issue
   * @param itemPid - The pid of the current item
   * @param recipients - array of email addresses
   * @returns Observable with boolean
   */
  addClaimIssue(itemPid: string, recipients: ITypeEmail[]): Observable<boolean> {
    const apiUrl = `${this._appConfigService.apiEndpointPrefix}/item/${itemPid}/issue/claims`;
    return this._http.post(apiUrl, {recipients}).pipe(
      map((_: unknown) => true),
      catchError(() => of(false))
    );
  }
}
