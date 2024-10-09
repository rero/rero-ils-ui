/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Injectable, inject } from '@angular/core';
import { ApiService, File, Record, RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourcesFilesService {

  private httpService: HttpClient = inject(HttpClient);
  private recordService: RecordService = inject(RecordService);
  private apiService: ApiService = inject(ApiService);
  private userService: UserService = inject(UserService);

  //api base URL
  baseUrl: string;

  // Current file parent record.
  currentParentRecord = new BehaviorSubject(null);

  // Current file parent record observable.
  currentParentRecord$ = this.currentParentRecord.asObservable();

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
  getParentRecord(pid: string): Observable<Record> {
    // get the current library pid
    const libPid = this.userService.user.currentLibrary;
    // retrieve the file record attached to the document and the current library
    return this.httpService
      .get(`${this.baseUrl}?q=metadata.document.pid:${pid} AND metadata.library.pid:${libPid}`)
      .pipe(
        map((result: Record) => {
          const total = this.recordService.totalHits(result.hits.total);
          if (total > 1) {
            throw new Error('More than one parent record.');
          }
          return total === 0 ? null : result.hits.hits[0];
        }),
        map((esResult: Record) => {
          if (esResult == null) {
            return esResult;
          }
          const metadata = esResult['metadata'];
          const docPid = metadata['document']['pid'];
          metadata['document'] = { $ref: this.apiService.getRefEndpoint('documents', docPid) };
          const libPid = metadata['library']['pid'];
          metadata['library'] = { $ref: this.apiService.getRefEndpoint('libraries', libPid) };
          return esResult;
        }),
        tap((record) => this.currentParentRecord.next(record))
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
  createParentRecord(docPid: string): Observable<Record> {
    // get the current library pid
    const libPid = this.userService.user.currentLibrary;
    // create the file record attached to the current library pid and the given
    // document
    return this.httpService
      .post(`${this.baseUrl}`, {
        metadata: {
          document: { $ref: this.apiService.getRefEndpoint('documents', docPid) },
          library: { $ref: this.apiService.getRefEndpoint('libraries', libPid) },
        },
      })
      .pipe(tap((record) => this.currentParentRecord.next(record))) as Observable<Record>;
  }

  /**
   * Updates the parent record metadata.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param metadata new metadata
   * @returns the modified record
   */
  updateParentRecordMetadata(pid: string, metadata: any): Observable<Record> {
    return this.httpService.put(`${this.baseUrl}/${pid}`, metadata) as Observable<Record>;
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
      .post(`${this.baseUrl}/${parentRecordId}/files`, [{ key: fileKey, label: fileData.label }])
      .pipe(
        switchMap((res: any) =>
          // set the file content
          this.httpService.put(`${this.baseUrl}/${parentRecordId}/files/${fileKey}/content`, fileData, {
            headers: { 'content-type': 'application/octet-stream' },
          })
        ),
        switchMap((res: any) => {
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
      switchMap((res) => this.create(parentRecordId, file.key, fileData))
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
              .pipe(tap(() => this.currentParentRecord.next(null)));
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
