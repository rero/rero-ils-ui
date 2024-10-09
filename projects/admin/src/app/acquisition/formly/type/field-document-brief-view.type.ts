/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-formly-field-type',
  template: `
    @if (record) {
      <shared-document-brief-view [record]="record"></shared-document-brief-view>
    }
  `
})
export class FieldDocumentBriefViewTypeComponent extends FieldType implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** record */
  record: any;

  /** OnInit hook */
  ngOnInit(): void {
    this.recordService
      .getRecord('documents', this.model['document'])
      .subscribe((data: any) => {
        this.record = data.metadata;
        this.changeDetectorRef.detectChanges();
      });
  }
}
