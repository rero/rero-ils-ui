/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { Component, computed, ElementRef, inject, input, OnInit, signal, viewChild, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RecordSearchStore, RecordService, DateTranslatePipe } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { Bind } from 'primeng/bind';
import { Inplace } from 'primeng/inplace';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { MigrationMetadataBriefComponent } from '../migration-metadata/migration-metadata.component';
import { DecimalPipe } from '@angular/common';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'admin-migration-data-deduplication',
    templateUrl: './migration-data-deduplication.component.html',
    imports: [Bind, Inplace, InputText, FormsModule, Button, Tag, TranslateDirective, MigrationMetadataBriefComponent, DecimalPipe, DateTranslatePipe, TranslatePipe, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MigrationDataDeduplicationBriefComponent implements OnInit {
  protected toastService = inject(MessageService);
  protected recordService = inject(RecordService);
  protected translateService = inject(TranslateService);
  protected searchStore = inject(RecordSearchStore);

  record = input<any>();
  type = input<string>();
  detailUrl = input<{ link: string; external: boolean }>();

  ilsPidInput = viewChild<ElementRef<HTMLInputElement>>('ilsPidInput');

  ilsPid = signal<string | null>(null);
  currentCandidate = signal<any | null>(null);
  currentCandidateIndex = signal(-1);

  candidates = computed<any[]>(() => this.record()?.metadata?.deduplication?.candidates ?? []);
  status = computed(() => this.record()?.metadata?.deduplication?.status);
  hasPrevious = computed(() => this.currentCandidateIndex() > 0);
  hasNext = computed(() => this.currentCandidateIndex() < this.candidates().length - 1);
  messages = computed((): { severity: string; detail: string }[] => {
    const messages: { severity: string; detail: string }[] = [];
    if (this.record()?.metadata?.deduplication?.logs) {
      ['info', 'warning', 'error'].forEach((field) => {
        const log = this.record()?.metadata?.deduplication?.logs[field];
        if (log) {
          messages.push({
            severity: field === 'warning' ? 'warn' : field,
            detail: log.join('<br/>'),
          });
        }
      });
    }
    return messages;
  });

  focusInput(): void {
    setTimeout(() => this.ilsPidInput()?.nativeElement.focus());
  }

  ngOnInit(): void {
    let ilsPid = this.record()?.metadata?.deduplication?.ils_pid;
    if (ilsPid == null && this.candidates().length > 0 && this.status() !== 'no match') {
      ilsPid = this.candidates()[0].json.pid;
    }
    this.updateCurrentCandidate(ilsPid);
    if (this.status() === 'no match') {
      this.currentCandidateIndex.set(-1);
      this.currentCandidate.set(null);
    }
  }

  updateCurrentCandidate(ilsPid: string | null): void {
    if (ilsPid == null || ilsPid === '') {
      this.currentCandidateIndex.set(-1);
      this.currentCandidate.set(null);
      this.ilsPid.set(null);
    } else {
      const existingCandidateIndex = this.candidates().findIndex((v: any) => v?.json?.pid == ilsPid);
      if (existingCandidateIndex > -1) {
        this.currentCandidateIndex.set(existingCandidateIndex);
        this.currentCandidate.set(this.record()?.metadata?.deduplication?.candidates[existingCandidateIndex]);
        this.updateIlsPid();
      } else {
        this.recordService.getRecords('documents', { query: `pid:${ilsPid}`, page: 1, itemsPerPage: 1 }).subscribe((results: any) => {
          if (results.hits.hits.length === 1) {
            const record = results.hits.hits[0].metadata;
            this.record().metadata.deduplication.candidates = [
              { pid: record.pid, json: record },
              ...this.candidates().filter((c: any) => c.score),
            ];
            this.currentCandidateIndex.set(0);
            this.currentCandidate.set(this.record()?.metadata?.deduplication?.candidates[0]);
            this.updateIlsPid();
          } else {
            this.toastService.add({ severity: 'warn', summary: this.translateService.instant('Record not found.') });
          }
        });
      }
    }
  }

  updateIlsPid(): void {
    const candidate = this.currentCandidate();
    if (candidate && this.ilsPid() !== candidate.json.pid) {
      this.ilsPid.set(candidate.json.pid);
    }
  }

  nextCandidate(): void {
    if (this.hasNext()) {
      const next = this.currentCandidateIndex() + 1;
      this.updateCurrentCandidate(this.candidates()[next].json.pid);
    }
  }

  previousCandidate(): void {
    if (this.hasPrevious()) {
      const prev = this.currentCandidateIndex() - 1;
      this.updateCurrentCandidate(this.candidates()[prev].json.pid);
    }
  }

  saveIlsPid(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.updateCurrentCandidate(value !== '' ? value : null);
  }

  reject(): void {
    this.ilsPid.set(null);
    this.save();
  }

  save(): void {
    this.recordService
      .update('migration_data', `${this.record().id}?migration=${this.record().metadata.migration_id}`, {
        ils_pid: this.ilsPid(),
        candidates: this.candidates(),
      })
      .subscribe((record: any) => {
        const config = this.searchStore.config();
        this.searchStore.fetchRecords({
          index: this.searchStore.currentIndex(),
          query: this.searchStore.queryString(),
          page: this.searchStore.page(),
          allowEmptySearch: config.allowEmptySearch,
          itemsPerPage: this.searchStore.size(),
          aggregationsFilters: this.searchStore.aggregationsFilters(),
          preFilters: config.preFilters,
          sort: this.searchStore.sort(),
          facets: this.searchStore.facetsParameter(),
          headers: config.listHeaders,
        });
        this.toastService.add({
          severity: 'success',
          summary: `${record.id} ` + this.translateService.instant('has been successfully updated.'),
          detail: this.translateService.instant('The status is now:') + ' ' + this.translateService.instant(record.deduplication.status),
        });
      });
  }
}
