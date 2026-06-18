// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectorRef, Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AbstractCanDeactivateComponent, CONFIG, RecordService, EditorComponent } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { EditorService } from '../../../service/editor.service';

@Component({
    selector: 'admin-document-editor',
    templateUrl: './document-editor.component.html',
    imports: [EditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Show Document Editor with a specific input: EAN import.
 */
export class DocumentEditorComponent extends AbstractCanDeactivateComponent {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private editorService: EditorService = inject(EditorService);
  private translateService: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private recordService: RecordService = inject(RecordService);
  private messageService: MessageService = inject(MessageService);

  /** Can deactivate from editor component */
  canDeactivate = false;

  // initial editor values
  model = {};

  /**
   * Retrieve information about an item regarding its EAN code using EditorService
   * @param source string - the external source
   * @param pid string - identifier of the external record
   */
  importFromExternalSource(source: string, pid: string): void {
    this.editorService.getRecordFromExternal(source, pid).subscribe(
      record => {
        if (record) {
          this.model = record.metadata;
          this.cdr.markForCheck();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('Import'),
            detail: this.translateService.instant('Does not exists on the remote server!'),
            life: CONFIG.MESSAGE_LIFE
          });
        }
      }
    );
  }

  /**
   * Get record by type and pid
   * @param type string - resource type
   * @param pid - resource pid
   */
  duplicateRecord(type: string, pid: string): void {
    this.recordService.getRecord(type, pid).subscribe(
      record => {
        if (record) {
          delete (record.metadata.pid);
          delete (record.metadata.harvested);
          this.model = record.metadata;
          this.cdr.markForCheck();
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Duplicate'),
            detail: this.translateService.instant('Document duplicated'),
            life: CONFIG.MESSAGE_LIFE
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('Duplicate'),
            detail: this.translateService.instant('This document does not exists!'),
            life: CONFIG.MESSAGE_LIFE
          });
        }
      }
    );
  }

  /**
   * To be notified when the child editor loading state change.
   *
   * An other approach can be to display the child component only when the
   * external source data are retrieved.
   *
   * @param value - true if the child editor component is currently loading data
   */
  loadingChanged(value: boolean): void {
    if (value === false) {
      combineLatest([this.route.params, this.route.queryParams])
      .subscribe(([_params, queryParams]) => {
        if (queryParams.pid) {
          if (queryParams.source && queryParams.source !== 'templates') {
            this.importFromExternalSource(queryParams.source, queryParams.pid);
          }
          if (queryParams.type) {
            this.duplicateRecord(queryParams.type, queryParams.pid);
          }
        }
      });
    }
  }
}
