/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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

import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { AppSettingsService } from '@rero/shared';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'public-search-document-detail-vew',
    templateUrl: './document-detail-view.component.html',
    standalone: false
})
export class DocumentDetailViewComponent implements OnInit {
  private appSettingsService: AppSettingsService = inject(AppSettingsService);
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);

  @Input() viewcode: string;
  @Input() documentpid: string;
  @Input() showinfo = 'false';

  document = null;
  exportItems: MenuItem[];

  /** OnInit hook */
  ngOnInit(): void {
    // Set view code to app settings
    this.appSettingsService.currentViewCode = this.viewcode;
    this.recordService.getRecord('documents', this.documentpid, 1).subscribe(doc => this.document = doc);
    this.exportItems = [
      {
        icon: "fa fa-file-code-o",
        label: this.translateService.instant("JSON Data"),
        url: `/api/documents/${this.documentpid}?format=json`
      },
      {
        icon: "fa fa-file-text-o",
        label: this.translateService.instant("RIS (Zotero...)"),
        url: `/api/documents/${this.documentpid}?format=ris`
      }
    ];
  }
}
