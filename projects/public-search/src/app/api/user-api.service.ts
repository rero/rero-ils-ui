// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@rero/ng-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);

  /**
   * Update password
   * @param data - password data
   * @returns Observable
   */
  updatePassword(data: IPassword): Observable<any> {
    return this.httpClient.post('/api/change-password', data);
  }

  validatePassword(password: string): Observable<any> {
    return this.httpClient.post(
      this.apiService.getEndpointByType('user/password/validate'),
      { 'password': password }
    );
  }
}

type IPassword = {
  password: string;
  new_password: string;
  new_password_confirm: string;
}
