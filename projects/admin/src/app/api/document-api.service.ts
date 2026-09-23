// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RecordData, RecordService } from '@rero/ng-core';
import { BaseApi, EsResult, IAvailability, IAvailabilityService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../service/app-config.service';
import { IAdvancedSearchConfig } from '../record/search-view/document-advanced-search-form/i-advanced-search-config-interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService extends BaseApi implements IAvailabilityService {

  private recordService: RecordService = inject(RecordService);
  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);

  /** Resource name */
  readonly RESOURCE_NAME = 'documents';

  /**
   * Get a document record.
   *
   * @param pid - document pid
   * @param resolve - resolve the `$ref` links of the record
   * @returns Observable of the document record
   */
  getDocument(pid: string, resolve = 1): Observable<RecordData> {
    return this.recordService.getRecord(
      this.RESOURCE_NAME, pid, { resolve, headers: BaseApi.reroJsonheaders });
  }

  /**
   * Get count of linked document(s) from current document (partOf)
   * @param documentPid - document pid
   * @returns Observable<int>
   */
  getLinkedDocumentsCount(documentPid: string): Observable<number> {
    return this.recordService.getRecords(
      this.RESOURCE_NAME, { query: `partOf.document.pid:${documentPid}`, page: 1, itemsPerPage: 1 }
    ).pipe(map((result: EsResult) => result.hits.total));
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
