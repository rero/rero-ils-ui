/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { EditorService } from '../../../service/editor.service';

@Component({
  selector: 'admin-document-editor',
  templateUrl: './document-editor.component.html'
})

/**
 * Show Document Editor with a specific input: EAN import.
 */
export class DocumentEditorComponent {

  // initial editor values
  model = {};

  /**
   * Constructor
   * @param _editorService - EditorService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _route - ActivatedRoute
   * @param _recordService - RecordService
   */
  constructor(
    private _editorService: EditorService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _route: ActivatedRoute,
    private _recordService: RecordService
  ) { }

  /**
   * Retrieve information about an item regarding its EAN code using EditorService
   * @param source string - the external source
   * @param pid string - identifier of the external record
   */
  importFromExternalSource(source: string, pid: string) {
    this._editorService.getRecordFromExternal(source, pid).subscribe(
      record => {
        if (record) {
          this.model = record.metadata;
        } else {
          this._toastrService.warning(
            this._translateService.instant('Does not exists on the remote server!'),
            this._translateService.instant('Import')
          );
        }
      }
    );
  }

  /**
   * Get record by type and pid
   * @param type string - resource type
   * @param pid - resource pid
   */
  duplicateRecord(type: string, pid: string) {
    this._recordService.getRecord(type, pid).subscribe(
      record => {
        if (record) {
          delete (record.metadata.pid);
          this.model = record.metadata;
          this._toastrService.success('Document duplicated');
        } else {
          this._toastrService.warning(
            this._translateService.instant('This document does not exists!'),
            this._translateService.instant('Duplicate')
          );
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
  loadingChanged(value: boolean) {
    if (value === false) {
      combineLatest([this._route.params, this._route.queryParams])
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
