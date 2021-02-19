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
import { Observable } from 'rxjs';
import { LoanOverduePreview } from '../classes/loans';

@Injectable({
  providedIn: 'root'
})
export class LoanApiService {

  /**
   * Constructor
   * @param _http - HttpClient
   */
  constructor(
    private _http: HttpClient
  ) {}


  /**
   * Get the preview overdue fees related to a specific loan
   * @param loanPid - string: the Loan pid
   */
  getPreviewOverdue(loanPid: string): Observable<LoanOverduePreview> {
    const url = `/api/loan/${loanPid}/overdue/preview`;
    return this._http.get<LoanOverduePreview>(url);
  }
}
