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
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, File, Record, RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourcesFilesService {
  // http service
  private httpService = inject(HttpClient);
  // ng-core record service
  private recordService = inject(RecordService);
  // ng-core api service
  private apiService = inject(ApiService);
  // user service to retrieve the current library
  private userService = inject(UserService);

  // translate service
  private translateService = inject(TranslateService);
  //api base URL
  baseUrl: string;

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
  getParentRecord(type: string, pid: string): Observable<Record> {
    // get the currend library pid
    const libPid = this.userService.user.currentLibrary;
    // retrieve the file record attached to the document and the current library
    return this.httpService
      .get(`${this.baseUrl}?q=metadata.links.keyword:doc_${pid} AND metadata.owners.keyword:lib_${libPid}`)
      .pipe(
        map((result: Record) => {
          const total = this.recordService.totalHits(result.hits.total);
          if (total > 1) {
            throw new Error('More than one parent record.');
          }
          return total === 0 ? null : result.hits.hits[0];
        })
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
  createParentRecord(type: string, pid: string): Observable<Record> {
    // get the currend library pid
    const libPid = this.userService.user.currentLibrary;
    // create the file record attached to the current library pid and the given
    // document
    return this.httpService.post(`${this.baseUrl}`, {
      metadata: {
        collections: ['col1'],
        links: [`doc_${pid}`],
        owners: [`lib_${libPid}`],
      },
    }) as Observable<Record>;
  }

  /**
   * Get the list of files for the given record.
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @returns Observable resolving the list of files.
   */
  list(type: string, pid: string, parentRecord: Record): Observable<Array<File>> {
    if (parentRecord == null) {
      return of([]);
    }
    return this.httpService.get(`${this.baseUrl}/${parentRecord.id}/files`).pipe(
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
  create(type: string, pid: string, parentRecord: Record, fileKey: string, fileData: any): Observable<File> {
    // create the bucket
    return this.httpService.post(`${this.baseUrl}/${parentRecord.id}/files`, [{ key: fileKey }]).pipe(
      switchMap((res: any) =>
        // set the file content
        this.httpService.put(`${this.baseUrl}/${parentRecord.id}/files/${fileKey}/content`, fileData, {
          headers: { 'content-type': 'application/octet-stream' },
        })
      ),
      switchMap((res: any) => {
        // commit the file
        return this.httpService.post(
          `${this.baseUrl}/${parentRecord.id}/files/${fileKey}/commit`,
          {}
        ) as Observable<File>;
      })
    );
  }

  /**
   * Replace an existing file.
   *
   * as it is not supported by invenio-records-resouces we remove the old version
   * and create a new one
   *
   * @param type Type of resource.
   * @param pid PID of the record.
   * @param parentRecord resource to host the file
   * @param fileKey File key.
   * @param fileData File data.
   * @returns the updated file
   */
  update(type: string, pid: string, parentRecord: Record, file: File, fileData: any): Observable<File> {
    return this.delete(type, pid, parentRecord, file, true).pipe(
      switchMap((res) => this.create(type, pid, parentRecord, file.key, fileData))
    );
  }

  /**
   * Create the form to change the file metadata.
   *
   * @param type Type of resource.
   * @returns an object with the form, the model and the formly params.
   */
  getMetadataForm(type: string): Observable<any> {
    // A simple label editor
    const metadataForm: {
      fields: Array<any>;
      model: any;
      form: any;
    } = {
      fields: [
        {
          key: 'label',
          type: 'input',
          props: {
            label: this.translateService.instant('Label'),
            minLength: 3,
            placeholder: this.translateService.instant('File label'),
          },
        },
      ],
      model: null,
      form: new UntypedFormGroup({}),
    };
    return of(metadataForm);
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
  delete(type: string, pid: string, parentRecord: Record, file: File, keepParent = false): Observable<any> {
    return (
      this.httpService
        // remove the file
        .delete(`${this.baseUrl}/${parentRecord.id}/files/${file.key}`)
        .pipe(
          switchMap(() => this.httpService.get(`${this.baseUrl}/${parentRecord.id}/files`)),
          map((res: any) => {
            if (
              keepParent === true ||
              res.entries.some((val) => !['thumbnail', 'fulltext'].includes(val?.metadata?.type))
            ) {
              return of(true);
            }
            // remove the file record
            return this.httpService.delete(`${this.baseUrl}/${parentRecord.id}`);
          })
        )
    );
  }

  /**
   * Return the URL of the file.
   *
   * @param type Type of resource.
   * @param pid Record PID.
   * @param fileKey File key.
   * @returns URL of the file.
   */
  getUrl(type: string, pid: string, file: File): string {
    const url = new URL(file.links.content);
    return url.href.replace(url.origin, '');
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
  updateMetadata(type: string, pid: string, parentRecord: Record, file: File): Observable<any> {
    return this.httpService.put(`${this.baseUrl}/${parentRecord.id}/files/${file.key}`, file.metadata);
  }
}
