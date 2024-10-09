/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { IAvailability, IAvailabilityService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../service/app-config.service';
import { IAdvancedSearchConfig } from '../record/search-view/document-advanced-search-form/i-advanced-search-config-interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService implements IAvailabilityService {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);

  /** Resource name */
  readonly RESOURCE_NAME = 'documents';

  /**
   * Get count of linked document(s) from current document (partOf)
   * @param documentPid - document pid
   * @returns Observable<int>
   */
  getLinkedDocumentsCount(documentPid: string): Observable<number> {
    return this.recordService.getRecords(
      this.RESOURCE_NAME, `partOf.document.pid:${documentPid}`, 1, 1
    ).pipe(map((result: Record) => result.hits.total.value));
  }

  /**
   * Get availability by document pid
   * @param pid - document pid
   * @returns Observable of availability data
   */
  getAvailability(pid: string): Observable<IAvailability> {
    const url = `${this.appConfigService.apiEndpointPrefix}/document/${pid}/availability`;
    return this.httpClient.get<IAvailability>(url);
  }

  /**
   * Get Advanced search configuration from the backend.
   * @returns The advanced Search config
   */
  getAdvancedSearchConfig(): Observable<IAdvancedSearchConfig> {
    const url = `${this.appConfigService.apiEndpointPrefix}/document/advanced-search-config`;
    return this.httpClient.get<IAdvancedSearchConfig>(url);
  }
}
