// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApi } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronApiService extends BaseApi {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get Messages
   * @return Observable
   */
  getMessages(patronPid: string): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`/api/patrons/${patronPid}/messages`);
  }

  getOverduePreviewByPatronPid(patronPid: string): Observable<any> {
    return this.httpClient.get(`/api/patrons/${patronPid}/overdues/preview`);
  }
}

/** Message envelop */
export type Message = {
  type: string;
  content: string;
}
