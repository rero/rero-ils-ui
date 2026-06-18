// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApi, IAvailability, IAvailabilityService } from '@rero/shared';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService extends BaseApi implements IAvailabilityService {

  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);

  /**
   * Get availability by document pid
   * @param pid - document pid
   * @returns Observable of availability data
   */
  getAvailability(pid: string, viewcode: string = null): Observable<IAvailability> {
    let url = `${this.appConfigService.apiEndpointPrefix}/document/${pid}/availability`;
    if (viewcode) {
      url += `?view_code=${viewcode}`;
    }
    return this.httpClient.get<IAvailability>(url);
  }
}
