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

import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-migration-data-deduplication',
  templateUrl: './migration-data-deduplication.component.html',
  styleUrl: './migration-data-deduplication.component.scss',
})
export class MigrationDataDeduplicationBriefComponent implements OnInit {
  // services
  protected toastService: MessageService = inject(MessageService);
  protected recordService: RecordService = inject(RecordService);
  protected translateService: TranslateService = inject(TranslateService);

  // current record
  record = input<any>();

  // need a result list refresh
  refresh = output<boolean>();

  // current ILS pid
  ilsPid = null;

  // current candidate
  currentCandidate = null;

  // current candidate index
  currentCandidateIndex = null;

  // message logs server
  messages = computed((): { severity: string; detail: string }[] => this.getMessages());

  //** OnInit hook */
  ngOnInit(): void {
    let ilsPid = this.record()?.metadata?.deduplication?.ils_pid;
    // get value from the backend if it exists
    if (ilsPid == null && this.candidates.length > 0 && this.status() !== 'no match') {
      ilsPid = this.candidates[0].json.pid;
    }
    // display the current candidate if exists
    this.updateCurrentCandidate(ilsPid);
    if (this.status() == 'no match') {
      this.currentCandidateIndex = -1;
      this.currentCandidate = null;
    }
  }

  /**
   * Get the backend log messages from the record.
   *
   * @returns list of messages on primeng format
   */
  getMessages(): { severity: string; detail: string }[] {
    const messages = [];
    if (this.record()?.metadata?.deduplication?.logs) {
      ['info', 'warning', 'error'].map((field) => {
        const log = this.record()?.metadata?.deduplication?.logs[field];
        if (log) {
          messages.push({
            severity: field == 'warning' ? 'warn' : field,
            detail: log.join('<br/>'),
          });
        }
      });
    }
    return messages;
  }

  // deduplication status.
  status = computed(() => this.record()?.metadata?.deduplication?.status);

  /**
   * Updates the current candidates.
   *
   * Retrieve the candidate from the current list else retrieve the candidate from the backend.
   *
   * @param ilsPid - the ILS pid value.
   */
  updateCurrentCandidate(ilsPid: string): void {
    // pid is null thus unselect
    if (ilsPid == null || ilsPid === '') {
      this.currentCandidateIndex = -1;
      this.currentCandidate = null;
      this.ilsPid = null;
    } else {
      const existingCandidateIndex = this.candidates.findIndex((v) => v?.json?.pid == ilsPid);
      // exists in the current list
      if (existingCandidateIndex > -1) {
        this.currentCandidateIndex = existingCandidateIndex;
        this.currentCandidate = this.record()?.metadata?.deduplication?.candidates[this.currentCandidateIndex];
        this.updateIlsPid();
      } else {
        // retrieve from the backend
        this.recordService.getRecords('documents', `pid:${ilsPid}`, 1, 1).subscribe((results: any) => {
          if (results.hits.hits.length == 1) {
            const record = results.hits.hits[0].metadata;
            // add to the candidate list at the first position
            this.record().metadata.deduplication.candidates = [
              { pid: record.pid, json: record },
              ...this.candidates.filter((c) => c.score),
            ];
            this.currentCandidateIndex = 0;
            this.currentCandidate = this.record()?.metadata?.deduplication?.candidates[this.currentCandidateIndex];
            this.updateIlsPid();
          } else {
            // no document from the backend
            this.toastService.add({ severity: 'warn', summary: this.translateService.instant('Record not found.') });
          }
        });
      }
    }
  }

  /**
   * Updates the ILS pid value if possible.
   */
  updateIlsPid(): void {
    if (this.currentCandidate) {
      if (this.ilsPid != this.currentCandidate.json.pid) {
        this.ilsPid = this.currentCandidate.json.pid;
      }
    }
  }

  // candidates shortcut
  get candidates(): any[] {
    const candidates = this.record()?.metadata?.deduplication?.candidates;
    if (candidates) {
      return candidates;
    }
    return [];
  }

  /**
   * Has the current candidate a previous value?
   * @returns true if exists
   */
  hasPrevious(): boolean {
    return this.currentCandidateIndex > 0;
  }
  /**
   * Has the current candidate a next value?
   * @returns true if exists
   */
  hasNext(): boolean {
    return this.currentCandidateIndex < this.candidates.length - 1;
  }

  /***
   * Set the next candidate as the current candidate.
   */
  nextCandidate(): void {
    if (this.hasNext()) {
      this.currentCandidateIndex += 1;
      this.updateCurrentCandidate(this.candidates[this.currentCandidateIndex].json.pid);
    }
  }

  /***
   * Set the previous candidate as the current candidate.
   */
  previousCandidate(): void {
    if (this.hasPrevious()) {
      this.currentCandidateIndex -= 1;
      this.updateCurrentCandidate(this.candidates[this.currentCandidateIndex].json.pid);
    }
  }

  /**
   * Set the current ILS pid from the input value and set the candidate accordingly.
   * @param event - keyboard event
   */
  saveIlsPid(event): void {
    const ilsPid = event.target.value != '' ? event.target.value : null;
    this.updateCurrentCandidate(ilsPid);
  }

  /**
   * Reject the candidates and set the status to "no match".
   */
  reject() {
    this.ilsPid = null;
    this.save();
  }

  /**
   * Save the candidates and the ILS pid value in the backend.
   */
  save(): void {
    this.recordService
      .update('migration_data', `${this.record().id}?migration=${this.record().metadata.migration_id}`, {
        ils_pid: this.ilsPid,
        candidates: this.candidates,
      })
      .subscribe((record: any) => {
        this.refresh.emit(true);
        this.toastService.add({
          severity: 'success',
          summary: `${record.id} ` + this.translateService.instant('has been sucessfully updated.'),
          detail: this.translateService.instant('The status is now:') + ' ' + this.translateService.instant(record.deduplication.status),
        });
      });
  }
}
