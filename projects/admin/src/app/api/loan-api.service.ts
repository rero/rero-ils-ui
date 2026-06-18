// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoanOverduePreview } from '../classes/loans';

@Injectable({
  providedIn: 'root'
})
export class LoanApiService {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get the preview overdue fees related to a specific loan
   * @param loanPid - string: the Loan pid
   */
  getPreviewOverdue(loanPid: string): Observable<LoanOverduePreview> {
    const url = `/api/loan/${loanPid}/overdue/preview`;
    return this.httpClient.get<LoanOverduePreview>(url);
  }
}
