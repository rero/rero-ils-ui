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
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, Record, RecordService } from '@rero/ng-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

// file interface
export interface File {
  // thumbnail URL
  thumbnail?: string;
  // download URL
  download: string;
  // thumbnail legend
  label: string;
  // preview URL
  preview?: string;
}

// Component itself
@Component({
  selector: 'shared-doc-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent implements OnInit, OnDestroy {
  // input document pid
  @Input() documentPid: string;

  // list of files
  files: File[] = [];
  // filtered array of files
  filteredFiles = [];
  // input text filter
  filterText = '';
  // number of visible items in the carousel
  numVisible = 5;
  // current page for the carousel
  page = 0;
  loading = false;

  // file to preview
  previewFile: {
    label: string;
    url: SafeUrl;
  };
  // modal for the invenio previewer
  previewModalRef: BsModalRef;

  // for modal
  @ViewChild('previewModal')
  previewModalTemplate: TemplateRef<any>;

  // -------- Services -------------
  // primeng configuration service
  private ngConfigService = inject(PrimeNGConfig);
  // http service
  private httpService = inject(HttpClient);
  // translation service
  private translateService = inject(TranslateService);
  // ng-core record service
  private recordService = inject(RecordService);
  // ng-core api service
  private apiService = inject(ApiService);
  // url sanitizer service
  private sanitizer = inject(DomSanitizer);
  // modal service
  private modalService = inject(BsModalService);
  // service to detect responsive breakpoints
  private breakpointObserver = inject(BreakpointObserver);

  /** all component subscription */
  private subscriptions = new Subscription();

  // contructor
  constructor() {
    // to avoid primeng error
    // TODO: remove this when primeng will be fixed
    this.ngConfigService.translation.aria.slideNumber = '{slideNumber}';
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.getFiles();
    this.changeNItemsOnCarousel();
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Changes the number of items in the carousel.
   *
   * To be responsive.
   */
  changeNItemsOnCarousel(): void {
    this.subscriptions.add(
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
        .subscribe((state: BreakpointState) => {
          switch (true) {
            case this.breakpointObserver.isMatched(Breakpoints.XSmall):
              this.numVisible = 1;
              break;
            case this.breakpointObserver.isMatched(Breakpoints.Small):
              this.numVisible = 2;
              break;
            case this.breakpointObserver.isMatched(Breakpoints.Medium):
              this.numVisible = 4;
              break;
            case this.breakpointObserver.isMatched(Breakpoints.Large):
              this.numVisible = 5;
              break;
          }
        })
    );
  }

  /**
   * Retrieves the files information from the backend.
   */
  getFiles(): void {
    const baseUrl = this.apiService.getEndpointByType('records');
    // retrieve all records files linked to a given document pid
    const query = `metadata.document.pid:${this.documentPid}`;
    this.loading = true;
    this.httpService
      .get(`${baseUrl}?q=${query}`)
      .pipe(
        map((result: Record) => (this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits)),
        map((hits: any[]) => hits.map((hit: any) => hit.id)),
        // get all files attached to the given records
        switchMap((ids: any[]) => {
          const obs = ids.map((id) => {
            return this.httpService.get(`${baseUrl}/${id}/files`).pipe(
              map((res: any) => {
                return {
                  id: id,
                  entries: res.entries,
                };
              })
            );
          });
          if (obs.length > 0) {
            return forkJoin(obs);
          }
          return of([]);
        }),
        tap(() => (this.loading = false))
      )
      .subscribe((res: any[]) => {
        const files = [];
        res.map((rec: any) => {
          const data = {};
          // retrieve main files
          rec.entries.map((entry) => {
            // main file (such as pdf)
            if (!['thumbnail', 'fulltext'].includes(entry?.metadata?.type)) {
              const dataFile: any = {
                label: entry?.metadata?.label ? entry.metadata.label : entry.key,
                mimetype: entry.mimetype,
                download: new URL(entry.links.content).pathname,
              };
              if (entry?.links?.preview) {
                dataFile.preview = new URL(entry.links.preview).pathname;
              }
              if (entry?.links?.thumbnail) {
                dataFile.thumbnail = new URL(entry.links.thumbnail).pathname;
              }
              data[entry.key] = dataFile;
            }
          });
          Object.values(data).map((d: File) => files.push(d));
        });
        files.sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
        this.files = files;
        this.filteredFiles = files;
        this.loading = false;
      });
  }
  /**
   * Fired when the text to filter the items changes.
   *
   * @param $event - standard event
   */
  onTextChange($event): void {
    if (this.filterText.length > 0) {
      this.filteredFiles = this.files.filter((value) => value.label.toLowerCase().includes(this.filterText.toLowerCase()));
    } else {
      this.filteredFiles = this.files;
    }
  }

  /**
   * Get the string used to display the search result number.
   * @param hits - list of hit results.
   * @returns observable of the string representation of the number of results.
   */
  getResultsText(): Observable<string> {
    const total = this.filteredFiles.length;
    if (total == this.files.length) {
      return this.translateService.stream('{{ total }} results', { total });
    }
    return total === 0
      ? this.translateService.stream('no result')
      : this.translateService.stream('{{ total }} results of {{ remoteTotal }}', {
          total,
          remoteTotal: this.files.length,
        });
  }

  /**
   * Fired when the page change in the paginator.
   * @param $event - standard event.
   */
  onPageChange($event): void {
    this.page = $event.page;
  }

  /**
   * Get the font awsome class depending on the file mimetype.
   *
   * @param file
   * @returns the css class of the icon
   */
  getIcon(file): string {
    const mimetype = file.mimetype;
    if (mimetype == null) {
      return 'fa-file-o';
    }
    switch (true) {
      case mimetype.startsWith('image/'):
        return 'fa-file-image-o';
      case mimetype.startsWith('audio/'):
        return 'fa-file-audio-o';
      case mimetype.startsWith('text/'):
        return 'fa-file-text-o';
      case mimetype.startsWith('video/'):
        return 'fa-file-video-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml'):
        return 'fa-file-powerpoint-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml'):
        return 'fa-file-word-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml'):
        return 'fa-file-excel-o';
      case mimetype.startsWith('application/pdf'):
        return 'fa-file-pdf-o';
    }
    return 'fa-file-o';
  }

  /** Open the file preview in a modal container.
   *
   * @param file - the file to preview.
   */

  preview(file: File): void {
    this.previewModalRef = this.modalService.show(this.previewModalTemplate, {
      class: 'modal-lg',
    });
    this.previewFile = {
      label: file.label,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(file.preview),
    };
  }
}
