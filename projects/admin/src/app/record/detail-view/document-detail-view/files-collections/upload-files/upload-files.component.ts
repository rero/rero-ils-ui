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

import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ResourcesFilesService } from '@app/admin/service/resources-files.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, Record } from '@rero/ng-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FileUpload } from 'primeng/fileupload';
import { Observable, catchError, concatMap, forkJoin, from, map, of, switchMap, tap, toArray } from 'rxjs';

@Component({
  selector: 'admin-upload-files',
  templateUrl: './upload-files.component.html'
})
export class UploadFilesComponent implements OnInit {

  // linked resource pid such as document
  @Input()
  pid: string;
  // List of files for the file ecord.
  files: Array<any> = undefined;
  // the maximum number of files by file record
  maxFiles = 500;
  // input text filter
  filterText = '';
  // filtered array of files
  filteredFiles = [];
  // A file record as used by rero-invenio-files.
  parentRecord: Record = null;

  // the primeng file upload component
  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  //------------- Services -------------
  // file service
  fileService = inject(ResourcesFilesService);
  // translate service
  translateService = inject(TranslateService);
  // toaster service
  toastrService = inject(ToastrService);
  // dialog service
  dialogService = inject(DialogService);
  // spinner service
  spinner = inject(NgxSpinnerService);
  //
  nUploadedFiles = 0;

  /**
   * Component initialization.
   *
   * Retrieve files from record
   */
  ngOnInit() {
    this.getFiles();
  }

  /**
   * Convert an absolute URL to a relative path
   *
   * @param url absolute url
   * @returns relative url
   */
  toRelative(url: string): string {
    const urlObj = new URL(url);
    return urlObj.href.replace(urlObj.origin, '');
  }

  /**
   * Update the file label.
   *
   * @param file the file object to update the label.
   * @param label the new label value.
   */
  updateLabel(file, label) {
    label = label.trim();
    if (label.length === 0 || file.label === label) {
      return;
    }
    this.fileService
      .updateMetadata(this.parentRecord.id, file.key, { ...file.metadata, label:label })
      .subscribe((res) => {
        const newLabel = res.metadata.label;
        file.label = newLabel;
        file.metadata.label = newLabel;
        this.toastrService.success(this.translateService.instant('Metadata have been saved successfully.'));
      });
  }


 // True if the maxiumum number of files is reached.
  get reachMaxFileLimit(): boolean {
    return this.files.length >= this.maxFiles;
  }

  /** Get the string used to display the search result number.
   * @param hits - list of hit results.
   * @returns observable of the string representation of the number of results.
   */
  getResultsText(): Observable<string> {
    const remoteTotal = this.files.length;
    const totalFiltered = this.filteredFiles.length;
    if (totalFiltered == this.files.length) {
      return this.translateService.stream('{{ total }} results', { total: remoteTotal });
    }
    return totalFiltered === 0
      ? this.translateService.stream('no result')
      : this.translateService.stream('{{ total }} results of {{ remoteTotal }}', {
          total: totalFiltered,
          remoteTotal: remoteTotal,
        });
  }

  /**
   * Fired when the text to filter the items changes.
   *
   * @param event the standard event.
   */
  onTextChange($event): void {
    if (this.filterText.length > 0) {
      this.filteredFiles = this.files.filter((value) => value.label.toLowerCase().includes(this.filterText.toLowerCase()));
    } else {
      this.filteredFiles = this.files;
    }
  }

  /**
   *
   * @param event the standard event.
   * @param _ unused.
   */
  uploadHandler(event, _) {
    let obs: Observable<any>;
    if (event.files.length > 0) {
      this.spinner.show('file-upload');
      if (this.parentRecord == null) {
        // create the parent record
        // should not happens when a document is used as parent record
        obs = this.fileService.createParentRecord(this.pid).pipe(
          map((record) => (this.parentRecord = record)),
          switchMap(() => {
            return this.generateCreateRequests(event);
          })
        );
      } else {
        // the parent record already exists create only the new file
        obs = this.generateCreateRequests(event);
      }
      obs
        .pipe(
          catchError((e: any) => {
            let msg = this.translateService.instant('Server error');
            if (e.error.message) {
              msg = `${msg}: ${e.error.message}`;
            }
            this.toastrService.error(msg);
            return of([]);
          }),
          tap(() => {
            this.resetFilter();
            this.fileUpload.clear();
            this.toastrService.success(this.translateService.instant('File uploaded successfully.'));
            this.nUploadedFiles = 0;
          }),
        )
        .subscribe(() => this.spinner.hide('file-upload'));
    }
  }

  /**
   * Generate the sequential http requests.
   *
   * @param event the standard event.
   * @returns an observable of sequential http requests
   */
  private generateCreateRequests(event): Observable<any> {
    return from(event.files).pipe(
      concatMap((f: any) => this.fileService.create(this.parentRecord.id, f.name, f)),
      map((file: any) => {
        this.nUploadedFiles += 1;
        this.files = [{ label: file.metadata.label ? file.metadata.label : file.key, ...file}, ...this.files];
        this.filteredFiles =  this.files;
      }),
      // like a forkJoin
      toArray()
      );
  }

  /**
   * Filter the uploaded files.
   *
   * @param event the standard event.
   * @param _ unused.
   */
  onSelect(event, _) {
    const existingFileNames = [];
    for (let i = 0; i < event.files.length; i++) {
      const fileName = event.files[i].name;
      if (this.files.some((v) => v.key == fileName)) {
        existingFileNames.push(fileName);
      } else {
        event.files[i].label = fileName;
      }
    }
    if (existingFileNames.length > 0) {
      this.fileUpload.msgs.push({
        severity: 'error',
        summary: 'This filename already exists.',
        detail: `${existingFileNames.join(', ')}`,
      });
      this.fileUpload.files = this.fileUpload.files.filter((v) => !existingFileNames.some((n) => n == v.name));
    }
    const numberOfMaxUploadedFiles = this.maxFiles - this.files.length;
    if (numberOfMaxUploadedFiles < this.fileUpload.files.length) {
      this.fileUpload.files = this.fileUpload.files.slice(0, numberOfMaxUploadedFiles);
    }
  }

  /**
   * Removes a given file.
   *
   * @param file
   */
  deleteFile(file: any) {
    // dialog confirmation
    this.dialogService
      .show({
        ignoreBackdropClick: true,
        initialState: {
          title: this.translateService.instant('Confirmation'),
          body: this.translateService.instant('Do you really want to remove this file?'),
          confirmButton: true,
          confirmTitleButton: this.translateService.instant('OK'),
          cancelTitleButton: this.translateService.instant('Cancel'),
        },
      })
      .pipe(
        switchMap((confirm: boolean) => {
          if (confirm === true) {
            // remove the file
            return this.fileService.delete(this.parentRecord.id, file.key).pipe(
              map(() => {
                this.files = this.files.filter((f) => f.key !== file.key);
                if (this.files.length === 0) {
                  this.parentRecord = null;
                }
                this.resetFilter();
                this.toastrService.success(this.translateService.instant('File removed successfully.'));
                return true;
              })
            );
          }
          return of(false);
        })
      )
      .subscribe();
  }

  /**
   * Reset the filtered files.
   */
  resetFilter() {
    this.filterText = '';
    this.filteredFiles = this.files;
  }

  /**
   * Observable for loading record and files.
   *
   * @returns Observable emitting files
   */
  private getFiles(): void {
    this.fileService.getParentRecord(this.pid).pipe(
      map((record: Record) => (this.parentRecord = record)),
      switchMap(() => {
        if(this.parentRecord == null) {
          return of([]);
        }
        return this.fileService.list(this.parentRecord.id);
      }),
      map((files) => {
        return files.map((item: any) => {
          if (item?.label == null) {
            item.label = item?.metadata?.label ? item.metadata.label : item.key;
          }
          return item;
        });
      }),
      map((files) => {
        files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        this.files = files;
        this.filteredFiles = files;
      }),
      catchError(() => {
        return of([]);
      })
    ).subscribe();
  }
}
