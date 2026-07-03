// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, inject, ChangeDetectionStrategy, signal, computed, effect, viewChild, untracked, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResourcesFilesService } from '@app/admin/service/resources-files.service';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CONFIG, FilesizePipe, DateTranslatePipe } from '@rero/ng-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { catchError, concatMap, from, map, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { FilesCollectionsComponent } from '../files-collections.component';
import { Bind } from 'primeng/bind';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Tooltip } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { Message } from 'primeng/message';

type ParentRecord = {
  id: string;
  metadata: Record<string, unknown>;
};

export type UploadedFile = {
  key: string;
  label: string;
  created: string;
  updated: string;
  size: string | number;
  metadata: Record<string, unknown> | null;
  links: { content?: string; [key: string]: unknown };
};

@Component({
    selector: 'admin-upload-files',
    templateUrl: './upload-files.component.html',
    imports: [FilesCollectionsComponent, TranslateDirective, Bind, FileUpload, InputGroup, FormsModule, InputText, InputGroupAddon, Tooltip, Button, FilesizePipe, TranslatePipe, DateTranslatePipe, NgxSpinnerComponent, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFilesComponent {

  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  fileService = inject(ResourcesFilesService);
  translateService = inject(TranslateService);
  spinner = inject(NgxSpinnerService);
  confirmationService = inject(ConfirmationService);

  // linked resource pid such as document
  pid = input<string>();

  // PrimeNG FileUpload component reference
  fileUpload = viewChild<FileUpload>('fileUpload');

  // the maximum number of files by file record
  readonly maxFiles = 500;

  // A file record as used by rero-invenio-files.
  parentRecord = signal<ParentRecord | null>(null);

  // List of files for the file record (undefined while loading).
  files = signal<UploadedFile[] | undefined>(undefined);

  // Counter of files uploaded in current session
  nUploadedFiles = signal<number>(0);

  // input text filter
  filterText = signal<string>('');

  // filtered array of files (computed from files and filterText)
  filteredFiles = computed(() => {
    const text = this.filterText().toLowerCase();
    const allFiles = this.files() ?? [];
    if (text.length === 0) return allFiles;
    return allFiles.filter(f => f.label.toLowerCase().includes(text));
  });

  // True if the maximum number of files is reached.
  reachMaxFileLimit = computed(() => (this.files()?.length ?? 0) >= this.maxFiles);

  constructor() {
    effect(() => {
      const pid = this.pid();
      if (pid) {
        untracked(() => this.getFiles(pid));
      }
    });
  }

  /**
   * Convert an absolute URL to a relative path.
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
  updateLabel(file: UploadedFile, label: string): void {
    label = label.trim();
    if (label.length === 0 || file.label === label) {
      return;
    }
    this.fileService
      .updateMetadata(this.parentRecord()!.id, file.key, { metadata: { ...(file.metadata ?? {}), label } })
      .subscribe((res) => {
        const newLabel = res.metadata.label as string;
        this.files.update(files =>
          (files ?? []).map(f => f.key === file.key ? { ...f, label: newLabel } : f)
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('File'),
          detail: this.translateService.instant('Metadata have been saved successfully.'),
          life: CONFIG.MESSAGE_LIFE
        });
      });
  }

  /** Get the string used to display the search result number. */
  getResultsText(): string {
    const remoteTotal = this.files()!.length;
    const totalFiltered = this.filteredFiles().length;
    if (totalFiltered === remoteTotal) {
      return this.translateService.instant('{{ total }} results', { total: remoteTotal });
    }
    return totalFiltered === 0
      ? this.translateService.instant('no result')
      : this.translateService.instant('{{ total }} results of {{ remoteTotal }}', {
          total: totalFiltered,
          remoteTotal,
        });
  }

  /**
   * @param event the standard event.
   * @param _ unused.
   */
  uploadHandler(event: { files: File[] }, _: unknown): void {
    let obs: Observable<unknown>;
    if (event.files.length > 0) {
      this.spinner.show('file-upload');
      if (this.parentRecord() == null) {
        // create the parent record
        // should not happens when a document is used as parent record
        obs = this.fileService.createParentRecord(this.pid()!).pipe(
          tap(record => this.parentRecord.set(record)),
          switchMap(() => this.generateCreateRequests(event))
        );
      } else {
        // the parent record already exists: create only the new files
        obs = this.generateCreateRequests(event);
      }
      obs
        .pipe(
          catchError((e: { error?: { message?: string } }) => {
            let msg = this.translateService.instant('Server error');
            if (e.error?.message) {
              msg = `${msg}: ${e.error.message}`;
            }
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('File'),
              detail: msg,
              sticky: true,
              closable: true
            });
            return of([]);
          }),
          tap(() => {
            this.filterText.set('');
            this.fileUpload()?.clear();
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('File'),
              detail: this.translateService.instant('File uploaded successfully.'),
              life: CONFIG.MESSAGE_LIFE
            });
            this.nUploadedFiles.set(0);
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
  private generateCreateRequests(event: { files: File[] }): Observable<unknown> {
    return from(event.files).pipe(
      concatMap(f => this.fileService.create(this.parentRecord()!.id, f.name, f)),
      map(raw => {
        this.nUploadedFiles.update(n => n + 1);
        const file = raw as unknown as UploadedFile;
        const label = (file.metadata?.['label'] as string | undefined) ?? file.key;
        this.files.update(files => [{ ...file, label }, ...(files ?? [])]);
      }),
      toArray()
    );
  }

  /**
   * Filter the uploaded files on select (check for duplicate filenames).
   *
   * @param event the standard event.
   * @param _ unused.
   */
  onSelect(event: { files: File[] }, _: unknown): void {
    const existingFileNames: string[] = [];
    for (const i of event.files) {
      const fileName = (event.files as unknown as Record<string, File>)[i as unknown as string]?.name;
      if ((this.files() ?? []).some((v) => v.key == fileName)) {
        existingFileNames.push(fileName);
      } else {
        (event.files as unknown as Record<string, { label?: string }>)[i as unknown as string].label = fileName;
      }
    }
    if (existingFileNames.length > 0) {
      this.fileUpload()?.msgs?.push({
        severity: 'error',
        summary: 'This filename already exists.',
        detail: `${existingFileNames.join(', ')}`,
      });
      this.fileUpload()!.files = this.fileUpload()!.files.filter((v) => !existingFileNames.some((n) => n == v.name));
    }
    const numberOfMaxUploadedFiles = this.maxFiles - (this.files()?.length ?? 0);
    if (numberOfMaxUploadedFiles < this.fileUpload()!.files.length) {
      this.fileUpload()!.files = this.fileUpload()!.files.slice(0, numberOfMaxUploadedFiles);
    }
  }

  /**
   * Removes a given file.
   *
   * @param file
   */
  deleteFile(file: UploadedFile): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('Confirmation'),
      message: this.translateService.instant('Do you really want to remove this file?'),
      acceptLabel: this.translateService.instant('OK'),
      rejectLabel: this.translateService.instant('Cancel'),
      icon: 'fa-solid fa-triangle-exclamation fa-2x core:text-red-500',
      acceptButtonStyleClass: 'core:bg-red-500 core:border-red-500',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.fileService.delete(this.parentRecord()!.id, file.key).pipe(
          map(() => {
            this.files.update(files => (files ?? []).filter(f => f.key !== file.key));
            if ((this.files()?.length ?? 0) === 0) {
              this.parentRecord.set(null);
            }
            this.filterText.set('');
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('File'),
              detail: this.translateService.instant('File removed successfully.'),
              life: CONFIG.MESSAGE_LIFE
            });
            return true;
          })
        ).subscribe();
      }
    });
  }

  /**
   * Load record and files for the given pid.
   */
  private getFiles(pid: string): void {
    this.fileService.getParentRecord(pid).pipe(
      tap(record => this.parentRecord.set(record)),
      switchMap(record => record == null ? of([]) : this.fileService.list(record.id)),
      map(files => (files as unknown as UploadedFile[]).map(item => {
        if (item.label == null) {
          item.label = (item.metadata?.['label'] as string | undefined) ?? item.key;
        }
        return item;
      })),
      map((files: UploadedFile[]) => {
        files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        this.files.set(files);
      }),
      catchError(() => of([])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
