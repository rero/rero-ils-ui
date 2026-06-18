// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ApiService, File } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourcesFilesService {

  private httpService: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);
  private appStore = inject(AppStore);

  //api base URL
  baseUrl: string;

  /** Current file parent record */
  readonly currentParentRecord = signal<any>(null);

  /**
   * Constructor.
   */
  constructor() {
    this.baseUrl = this.apiService.getEndpointByType('records');
  }

  /**
   * Get the file parent record.
   *
   * It can be a resource such as document or a dedicated resource
   * (rero-invenio-files).
   *
   * @param type
   * @param pid
   * @returns
   */
  getParentRecord(pid: string): Observable<any> {
    // get the current library pid
    const libPid = this.appStore.currentLibraryPid();
    // retrieve the file record attached to the document and the current library
    return this.httpService
      .get(`${this.baseUrl}?q=metadata.document.pid:${pid} AND metadata.library.pid:${libPid}`)
      .pipe(
        map((result: parentRecord) => {
          const { total } = result.hits;
          if (total > 1) {
            throw new Error('More than one parent record.');
          }
          return total === 0 ? null : result.hits.hits[0];
        }),
        map((esResult: any) => {
          if (esResult == null) {
            return esResult;
          }
          const { metadata } = esResult;
          metadata.document = { $ref: this.apiService.getRefEndpoint('documents', metadata.document.pid) };
          metadata.library = { $ref: this.apiService.getRefEndpoint('libraries', metadata.library.pid) };
          return esResult;
        }),
        tap((record) => this.currentParentRecord.set(record))
      );
  }

  /**
   * Create the file parent record.
   *
   * It can be a resource such as document or a dedicated resource
   * (rero-invenio-files). Here we assume the first case thus it should
   * exists.
   *
   * @param type
   * @param pid
   */
  createParentRecord(docPid: string): Observable<any> {
    // get the current library pid
    const libPid = this.appStore.currentLibraryPid();
    // create the file record attached to the current library pid and the given
    // document
    return this.httpService
      .post(`${this.baseUrl}`, {
        metadata: {
          document: { $ref: this.apiService.getRefEndpoint('documents', docPid) },
          library: { $ref: this.apiService.getRefEndpoint('libraries', libPid) },
        },
      })
      .pipe(tap((record) => this.currentParentRecord.set(record))) as Observable<any>;
  }

  /**
   * Updates the parent record metadata.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param metadata new metadata
   * @returns the modified record
   */
  updateParentRecordMetadata(pid: string, metadata: any): Observable<any> {
    return this.httpService.put(`${this.baseUrl}/${pid}`, metadata) as Observable<any>;
  }

  /**
   * Get the list of files for the given record.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @returns Observable resolving the list of files.
   */
  list(parentRecordId: string): Observable<File[]> {
    return this.httpService.get(`${this.baseUrl}/${parentRecordId}/files`).pipe(
      map((res: any) => {
        return res.entries.map((file) => {
          // set the head if is not a thumbnail nor a fulltext
          if (!['thumbnail', 'fulltext'].includes(file?.metadata?.type)) {
            file.is_head = true;
          }
          if (file.metadata == null) {
            file.metadata = { label: file.key };
          }
          return file;
        });
      })
    );
  }

  /**
   * Upload a new file and create the corresponding data.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param parentRecord resource to host the file
   * @param fileKey File key.
   * @param fileData File data.
   * @returns the created file
   */
  create(parentRecordId: string, fileKey: string, fileData: any): Observable<File> {
    // Note: angular do not encode % into %25 and nginx does not support single %
    fileKey = fileKey.replaceAll('%', '');
    // create the bucket
    return this.httpService
      .post(`${this.baseUrl}/${parentRecordId}/files`, [{ key: fileKey, metadata: { label: fileData.label }}])
      .pipe(
        switchMap((_res: any) =>
          // set the file content
          this.httpService.put(`${this.baseUrl}/${parentRecordId}/files/${fileKey}/content`, fileData, {
            headers: { 'content-type': 'application/octet-stream' },
          })
        ),
        switchMap((_res: any) => {
          // commit the file
          return this.httpService.post(
            `${this.baseUrl}/${parentRecordId}/files/${fileKey}/commit`,
            {}
          ) as Observable<File>;
        })
      );
  }

  /**
   * Replace an existing file.
   *
   * as it is not supported by invenio-records-resources we remove the old version
   * and create a new one
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param parentRecord resource to host the file
   * @param fileKey File key.
   * @param fileData File data.
   * @returns the updated file
   */
  update(parentRecordId: string, file: File, fileData: any): Observable<File> {
    return this.delete(parentRecordId, file.key, true).pipe(
      switchMap((_res) => this.create(parentRecordId, file.key, fileData))
    );
  }

  /**
   * Remove a given file.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param parentRecord resource to host the file
   * @param file File to delete.
   * @return Observable of the http response.
   */
  delete(parentRecordId: string, fileKey: string, keepParent = false): Observable<any> {
    return (
      this.httpService
        // remove the file
        .delete(`${this.baseUrl}/${parentRecordId}/files/${fileKey}`)
        .pipe(
          switchMap(() => this.httpService.get(`${this.baseUrl}/${parentRecordId}/files`)),
          switchMap((res: any) => {
            if (
              keepParent === true ||
              res.entries.some((val) => !['thumbnail', 'fulltext'].includes(val?.metadata?.type))
            ) {
              return of(true);
            }
            // remove the file record
            return this.httpService
              .delete(`${this.baseUrl}/${parentRecordId}`)
              .pipe(tap(() => this.currentParentRecord.set(null)));
          })
        )
    );
  }

  /**
   * Update the file metadata.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param parentRecord resource to host the file
   * @param file File to delete.
   * @return Observable of the updated data.
   */
  updateMetadata(parentRecordId: string, fileKey: string, data: any): Observable<any> {
    return this.httpService.put(`${this.baseUrl}/${parentRecordId}/files/${fileKey}`, data);
  }
}

export type parentRecord = {
  hits: {
    hits: any[];
    total: number;
  };
  sortBy: string;
  links: any;
}
