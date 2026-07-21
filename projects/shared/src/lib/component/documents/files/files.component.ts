// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, signal, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ApiService, RecordService } from '@rero/ng-core';
import type { EsResult } from '@rero/ng-core';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Carousel } from 'primeng/carousel';
import { NgClass, AsyncPipe } from '@angular/common';
import { Paginator } from 'primeng/paginator';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { FaIconClassPipe } from '../../../pipe/fa-icon-class.pipe';

// file interface
export type File = {
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
    imports: [Bind, Tag, RouterLink, FormsModule, Carousel, NgClass, Paginator, Dialog, InputGroup, InputGroupAddon, InputText, AsyncPipe, TranslatePipe, FaIconClassPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesComponent {

  protected httpService: HttpClient = inject(HttpClient);
  protected translateService: TranslateService = inject(TranslateService);
  protected recordService: RecordService = inject(RecordService);
  protected apiService: ApiService = inject(ApiService);
  protected sanitizer: DomSanitizer = inject(DomSanitizer);
  protected breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  protected dialogService: DialogService = inject(DialogService);

  // INPUTS ===================================================================
  readonly documentPid = input<string>(undefined);
  readonly routerPath = input.required<string[]>();
  readonly useHref = input(false);

  // STATE ====================================================================
  readonly isLoading = signal(false);
  readonly filterText = signal('');
  readonly page = signal(0);
  readonly previewVisible = signal(false);
  readonly previewFile = signal<{ label: string; url: SafeUrl } | null>(null);

  // SIGNALS ==================================================================

  /** Number of visible carousel items, reactive to viewport breakpoints */
  readonly numVisible: Signal<number> = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        map(() => {
          if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) return 1;
          if (this.breakpointObserver.isMatched(Breakpoints.Small)) return 2;
          if (this.breakpointObserver.isMatched(Breakpoints.Medium)) return 4;
          return 5;
        })
      ),
    { initialValue: 5 }
  );

  /** Source of truth: files + collections fetched from the API */
  private readonly _data = toSignal(
    toObservable(this.documentPid).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(pid => {
        const baseUrl = this.apiService.getEndpointByType('records');
        return this.httpService.get(`${baseUrl}?q=metadata.document.pid:${pid}`).pipe(
          map((result: EsResult) =>
            +this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits
          ),
          switchMap((hits: any[]) => {
            const collections = Array.from(new Set(
              hits.flatMap(hit => Array.isArray(hit.metadata.collections) ? hit.metadata.collections as string[] : [])
            ));
            const obs = hits.map(hit =>
              this.httpService.get(`${baseUrl}/${hit.id}/files`).pipe(
                map((res: any) => ({ id: hit.id, entries: res.entries }))
              )
            );
            return (obs.length > 0 ? forkJoin(obs) : of([])).pipe(
              map((recs: any[]) => ({ files: this._processFiles(recs), collections }))
            );
          }),
          tap(() => this.isLoading.set(false)),
          catchError(() => {
            this.isLoading.set(false);
            return of({ files: [], collections: [] });
          })
        );
      })
    ),
    { initialValue: null }
  );

  readonly files: Signal<File[]> = computed(() => this._data()?.files ?? []);
  readonly collections: Signal<string[]> = computed(() => this._data()?.collections ?? []);

  readonly filteredFiles: Signal<File[]> = computed(() => {
    const text = this.filterText().toLowerCase();
    const files = this.files();
    return text ? files.filter(f => f.label.toLowerCase().includes(text)) : files;
  });

  // PUBLIC FUNCTIONS =========================================================

  getQueryParams(collection: string): { q: string; simple: string } {
    const escapedCollection = collection.replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, '\\$&');
    return { q: `files.collections.raw:(${escapedCollection})`, simple: '0' };
  }

  getHref(collection: string): string {
    const params = this.getQueryParams(collection);
    const queryString = new URLSearchParams(params).toString();
    const routerPath = [...this.routerPath()];
    if (routerPath[0] === '/') {
      routerPath[0] = '';
    }
    return `${routerPath.join('/')}?${queryString}`;
  }

  getResultsText(): Observable<string> {
    const total = this.filteredFiles().length;
    if (total === this.files().length) {
      return this.translateService.stream('{{ total }} results', { total });
    }
    return total === 0
      ? this.translateService.stream('no result')
      : this.translateService.stream('{{ total }} results of {{ remoteTotal }}', {
          total,
          remoteTotal: this.files().length,
        });
  }

  onPageChange($event: any): void {
    this.page.set($event.page);
  }

  getIcon(file: any): string {
    const { mimetype } = file;
    if (mimetype == null) return 'fa-regular fa-file';
    switch (true) {
      case mimetype.startsWith('image/'): return 'fa-regular fa-file-image';
      case mimetype.startsWith('audio/'): return 'fa-regular fa-file-audio';
      case mimetype.startsWith('text/'): return 'fa-regular fa-file-lines';
      case mimetype.startsWith('video/'): return 'fa-regular fa-file-video';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml'): return 'fa-regular fa-file-powerpoint';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml'): return 'fa-regular fa-file-word';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml'): return 'fa-regular fa-file-excel';
      case mimetype.startsWith('application/pdf'): return 'fa-regular fa-file-pdf';
    }
    return 'fa-regular fa-file';
  }

  preview(file: File): void {
    this.previewFile.set({
      label: file.label,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(file.preview),
    });
    this.previewVisible.set(true);
  }

  // PRIVATE FUNCTIONS ========================================================

  private _processFiles(recs: any[]): File[] {
    const files: File[] = [];
    recs.forEach(rec => {
      const data: Record<string, File> = {};
      rec.entries.forEach((entry: any) => {
        if (!['thumbnail', 'fulltext'].includes(entry?.metadata?.type)) {
          const dataFile: any = {
            label: entry?.metadata?.label ? entry.metadata.label : entry.key,
            mimetype: entry.mimetype,
            download: new URL(entry.links.content).pathname,
          };
          if (entry?.links?.preview) dataFile.preview = new URL(entry.links.preview).pathname;
          if (entry?.links?.thumbnail) dataFile.thumbnail = new URL(entry.links.thumbnail).pathname;
          data[entry.key] = dataFile;
        }
      });
      Object.values(data).forEach(d => files.push(d));
    });
    files.sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
    return files;
  }
}
