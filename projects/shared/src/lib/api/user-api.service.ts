// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CoreConfigService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  protected httpClient: HttpClient = inject(HttpClient);
  protected configService: CoreConfigService = inject(CoreConfigService);

  /**
   * Get logged user
   * @return Observable
   */
  getLoggedUser(): Observable<any> {
    return this.httpClient.get<any>(User.LOGGED_URL);
  }

  /**
   * Update a patron password.
   *
   * @param username - patron username
   * @param password - new password
   * @return Observable
   */
  public changePassword(username: string, password: string) {
    const data = {
      username,
      new_password: password,
      new_password_confirm: password
    };
    const url = `${this.configService.apiEndpointPrefix}/change-password`;
    return this.httpClient.post<any>(url, data);
  }
}
