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

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryStatisticsService {

  // SERVICE ATTRIBUTES =======================================================
  private _defaultParams: CirculationStatisticsParameters = {
    from: 'now-7d',
    to: 'now',
    interval: '1d',
    operation: ['checkin', 'checkout', 'extend']
  };

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _httpClient - HttpClient
   * @param _translateService - TranslateService
   */
  constructor(
    private _httpClient: HttpClient,
    private _translateService: TranslateService
  ) { }

  // SERVICE FUNCTIONS ========================================================
  /**
   * Get circulation statistics for a specific library
   * @param libraryPid - the library pid
   * @param filters - parameters used to filter statistics
   * @returns the circulation statistics as JSON data
   */
  getCirculationStatistics(
    libraryPid: string,
    filters?: CirculationStatisticsParameters
  ): Observable<any> {

    // prepare http parameters from filters
    filters = {...this._defaultParams, ...filters};
    filters.operation = (Array.isArray(filters.operation))
      ? filters.operation.join(',')
      : filters.operation;
    const httpParams = new HttpParams({fromObject: filters as any});

    // call the backend API and map response
    const url = `/api/library/${libraryPid}/statistics/circulation`;
    return this._httpClient
      .get(url, {params: httpParams})
      .pipe(
        map(apiResponse => {
          const output = [];
          Object.entries(apiResponse).forEach(([key, data]) => {
            const series = [];
            Object.entries(data.operations).forEach(([op, value]) => series.push({name: op, value}));
            output.push({name: key, series});
          });
          return output;
        })
      );
  }

  /**
   * Get circulation rate statistics for a specific library
   * Circulation rate statistics are circulation metrics for a time period aggregate on daily timestamp
   * @param libraryPid - the library pid
   * @param filters - parameters used to filter statistics
   * @returns the circulation statistics as JSON data
   */
  getCirculationRateStatistics(
    libraryPid: string,
    filters?: CirculationStatisticsParameters
  ): Observable<any> {
    // prepare http parameters from filters
    filters = {...this._defaultParams, ...filters};
    filters.operation = (Array.isArray(filters.operation))
      ? filters.operation.join(',')
      : filters.operation;
    const httpParams = new HttpParams({fromObject: filters as any});

    // call the backend API and map response
    const url = `/api/library/${libraryPid}/statistics/circulation_rate`;
    return this._httpClient
      .get(url, {params: httpParams})
      .pipe(
        map(apiResponse => {  // convert API response to ngx-charts data series
          const operationsMap = new Map();
          Object.entries(apiResponse).forEach(([timestamp, operations]) => {
            Object.entries(operations).forEach(([operationName, value]) => {
              if(!operationsMap.has(operationName)) {
                operationsMap.set(operationName, {name: operationName, series: []});
              }
              operationsMap.get(operationName).series.push({name: timestamp, value})
            });
          });
          const output = [];
          operationsMap.forEach((series, _) => output.push(series));
          return output;
        })
      );
  }

  /**
   * Get the document type repartition statistics for a specific library
   * @param libraryPid - the library pid
   * @param documentType - the main document type. If specified, the result should be subtype repartition
   * @param excludes - the list of value to exclude from result.
   * @return the document type repartition statistics
   */
  getDocTypeRepartitionStatistics(
    libraryPid: string,
    documentType?: string,
    excludes?: Array<string>
  ): Observable<any> {
    const httpParams = new HttpParams();
    if (documentType !== undefined) {
      httpParams.append('docType', documentType);
    }
    if (excludes !== undefined && excludes.length > 0){
      excludes.forEach(exclude => httpParams.append('exclude', exclude));
    }
    const url = `/api/library/${libraryPid}/statistics/document_type_repartition`;
    return this._httpClient
      .get(url, {params: httpParams})
      .pipe(
        map(apiResponse => {
          const output = [];
          Object.entries(apiResponse).forEach(([key, value]) => {
            output.push({name: this._translateService.instant(key), value});
          });
          output.sort((a, b) => b.value - a.value);
          return output;
        })
      );
  }
}

/** Interface to describe circulation operations query string parameters */
export interface CirculationStatisticsParameters {
  from?: string;
  to?: string;
  interval?: string;
  operation?: string | string[];
}
