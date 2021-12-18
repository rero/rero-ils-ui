/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { IssueItemStatus } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Prediction issue structure
 */
export interface PredictionIssue {
  issue: string;
  expected_date: string;
}


@Injectable({
  providedIn: 'root'
})
export class HoldingsService {

  /**
   * Constructor
   * @param _http - HttpClient
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get prediction preview for given serial patterns.
   * @param holdingPid - string: the holding PID
   * @param size - number: the number of preview
   * @returns an object with an issues property containing the list of samples
   */
  getHoldingPatternPreview(holdingPid: string, size = 10): Observable<PredictionIssue[]> {
    const url = `/api/holding/${holdingPid}/patterns/preview`;
    let params = new HttpParams();
    params = params.set('size', size.toString());
    return this._http.get<any>(url, { params }).pipe(
      map(data => data.issues.reverse())
    );
  }

  /**
   * Issue quick receive
   * This function allow to create an "issue" item based on minimum information
   * @param holding: the parent holding.
   * @param displayText: (optional) the predicted numbering for the new issue
   * @param receivedDate: (optional) the received date for the new issue
   * @return an Observable on receive issue API
   */
  quickReceivedIssue(holding: any, displayText?: string, receivedDate?: string) {
    const url = `/api/holding/${holding.id}/issues`;
    const data: any = {};
    if (displayText || receivedDate) {
      data.issue = {};
      if (displayText) {
        data.enumerationAndChronology = displayText;
      }
      if (receivedDate) {
        data.issue.received_date = receivedDate;
      }
    }
    return this._http.post<any>(url, data);
  }

  /**
   * This function return issue icon based on its status
   */
  getIcon(status: IssueItemStatus): string {
    switch (status) {
      case IssueItemStatus.DELETED: return 'fa-circle text-danger';
      case IssueItemStatus.CLAIMED: return 'fa-envelope text-warning';
      case IssueItemStatus.RECEIVED: return 'fa-circle text-success';
      case IssueItemStatus.LATE: return 'fa-envelope-open-o text-warning';
      default: return 'fa-circle text-dark';
    }
  }

  /**
   * Check if an holding can be requested.
   * @param holdingPid: the holding pid to check
   * @param libraryPid: the library_pid to check
   * @param patronBarcode: the patron barcode to check
   * @return an observable on the API call response
   */
   canRequest(holdingPid: string, libraryPid?: string, patronBarcode?: string): Observable<any> {
    let params = new HttpParams();
    if (libraryPid != null) {
      params = params.set('library_pid', libraryPid);
    }
    if (patronBarcode != null) {
      params = params.set('patron_barcode', patronBarcode);
    }
    return this._http.get(`/api/holding/${holdingPid}/can_request`, { params });
  }

  /**
   * Get the available pickup locations for an item.
   * @param itemPid: the item pid to be requested
   * @return an observable on the API call response
   */
   getPickupLocations(holdingPid): Observable<any> {
    const url = `/api/holding/${holdingPid}/pickup_locations`;
    return this._http.get<any>(url).pipe(
      map(data => data.locations),
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    );
  }
}
