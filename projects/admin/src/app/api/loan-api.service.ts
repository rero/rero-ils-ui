/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { Observable } from 'rxjs';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoanApiService extends AbstractApiService {

  static RESOURCE_TYPE_NAME = 'loans';

  // CONSTRUCTOR ====================================================
  /**
   * Constructor
   * @param _http - HttpClient
   */
  constructor(
    private _http: HttpClient
  ) {
    super();
  }

  // HTTP METHODS ===================================================
  /**
   * Send an REST update request about a Loan
   * @param pid: the `Loan` to update
   * @param data: an object where each key is the data to patch
   */
  patch(pid: string, data: Array<any> = []): Observable<any> {
    const url = `/api/${LoanApiService.RESOURCE_TYPE_NAME}/${pid}`;
    this.convertPatchData(data);
    return this._http.patch<any>(url, JSON.stringify(data), AbstractApiService.HEADERS_PATCH_METHOD);
  }
}
