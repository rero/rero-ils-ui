// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService, Error, RecordService } from '@rero/ng-core';
import { BaseApi, EsResult, esResultInitialState, IAvailability, IAvailabilityService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from '../service/app-config.service';
import { ITypeEmail } from '../shared/preview-email/IPreviewInterface';
import { EsRecord } from '@rero/shared';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService implements IAvailabilityService {

  private appConfigService: AppConfigService = inject(AppConfigService);
  private apiService: ApiService = inject(ApiService);
  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);

  // SERVICE ATTRIBUTES =======================================================
  /** resource name */
  static readonly RESOURCE_NAME = 'items';

  /** http client options */
  private httpClientOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getItemsByHoldings(holdings: Partial<EsRecord>, page: number, itemsPerPage = 10, filter = ''): Observable<EsResult> {
    let query = `holding.pid:${holdings.metadata.pid}`;
    let sort = '';
    switch (holdings.metadata.holdings_type) {
      case 'serial':
        query += ' AND -issue.status:(claimed OR deleted OR late)';
        sort = '-issue_sort_date';
        break;
      case 'standard':
        sort = 'enumeration_chronology';
        break;
    }
    if (filter !== '') {
      query += ` AND (enumerationAndChronology.analyzed:"${filter}" OR call_numbers:(*${filter}*) OR barcode:(*${filter}*))`;
    }
    return this.recordService.getRecords(
      ItemApiService.RESOURCE_NAME,
      { query, page, itemsPerPage, headers: BaseApi.reroJsonheaders, sort }
    ).pipe(
      catchError(() => of(esResultInitialState)),
      map((response: EsResult) => response)
    );
  }

  // SERVICE FUNCTIONS ========================================================
  /**
   * Get an Item through the REST-API
   * @param pid: the item pid
   * @param resolve: if $ref should be resolved.
   * @returns: an `Observable` on REST-API item metadata result
   */
  getItem(pid: string, resolve = false): Observable<any> {
    return this.recordService
      .getRecord(ItemApiService.RESOURCE_NAME, pid, resolve ? { resolve: 1 } : undefined)
      .pipe(
        map((result: any) => result.metadata)
      );
  }

  /**
   * Allow to update the owning location of an item.
   * @param item: the item object to update
   * @param newLocationPid: the new owning location pid
   */
  updateLocation(item: any, newLocationPid: string): Observable<object | Error> {
    item.location.$ref = this.apiService.getRefEndpoint('locations', newLocationPid);
    return this.recordService.update(ItemApiService.RESOURCE_NAME, item.pid, item);
  }

  /**
   * Get stats of the item
   * @param itemPid - The item pid
   * @returns Observable of the stats of item
   */
  getStatsByItemPid(itemPid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.appConfigService.apiEndpointPrefix}/item/${itemPid}/stats`);
  }

  /**
   * Get Preview by item pid
   * @param itemPid - The pid of the current item
   * @returns Observable of the Preview of a claim and suggested email addresses.
   */
  getPreviewByItemPid(itemPid: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.appConfigService.apiEndpointPrefix}/item/${itemPid}/issue/claims/preview`,
      this.httpClientOptions
    ).pipe(catchError((err: any) => of({ error: err.error.message })));
  }

  /**
   * Add a new claim issue
   * @param itemPid - The pid of the current item
   * @param recipients - array of email addresses
   * @returns Observable with boolean
   */
  addClaimIssue(itemPid: string, recipients: ITypeEmail[]): Observable<boolean> {
    const apiUrl = `${this.appConfigService.apiEndpointPrefix}/item/${itemPid}/issue/claims`;
    return this.httpClient.post(apiUrl, {recipients}).pipe(
      map(() => true),
      catchError(() => of(false))
    );
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
