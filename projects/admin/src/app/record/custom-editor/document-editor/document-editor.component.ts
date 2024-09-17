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

import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AbstractCanDeactivateComponent, RecordService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { EditorService } from '../../../service/editor.service';

@Component({
  selector: 'admin-document-editor',
  templateUrl: './document-editor.component.html'
})

/**
 * Show Document Editor with a specific input: EAN import.
 */
export class DocumentEditorComponent extends AbstractCanDeactivateComponent {

  private messageService = inject(MessageService);

  /** Can deactivate from editor component */
  canDeactivate: boolean = false;

  // initial editor values
  model = {};

  /**
   * Constructor
   * @param editorService - EditorService
   * @param translateService - TranslateService
   * @param route - ActivatedRoute
   * @param recordService - RecordService
   */
  constructor(
    private editorService: EditorService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private recordService: RecordService
  ) { super() }

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
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('Import'),
            detail: this.translateService.instant('Does not exists on the remote server!')
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
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Duplicate'),
            detail: this.translateService.instant('Document duplicated')
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('Duplicate'),
            detail: this.translateService.instant('This document does not exists!')
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
      .subscribe(([params, queryParams]) => {
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
