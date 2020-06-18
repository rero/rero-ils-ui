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

import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from '../../../service/editor.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'admin-document-editor',
  templateUrl: './document-editor.component.html'
})

/**
 * Show Document Editor with a specific input: EAN import.
 */
export class DocumentEditorComponent implements  OnInit  {

  model = {};

  constructor(
    private editorService: EditorService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private _route: ActivatedRoute

  ) {}

  ngOnInit() {
    combineLatest([this._route.params, this._route.queryParams])
      .subscribe(([params, queryParams]) => {
        if (queryParams.source != null && queryParams.pid != null) {
          this.importFromExternalSource(queryParams.source, queryParams.pid);
        }
      }
    );
  }
  /**
   * Retrieve information about an item regarding its EAN code using EditorService
   * @param source string - the external source
   * @param pid string - identifier of the external record
   */
  importFromExternalSource(source: string, pid: string) {
    this.editorService.getRecordFromExternal(source, pid).subscribe(
      record => {
        if (record) {
          this.model = record.metadata;
        } else {
          this.toastrService.warning(
            this.translateService.instant('Does not exists on the remote server!'),
            this.translateService.instant('Import')
          );
        }
      }
      );
  }
}
