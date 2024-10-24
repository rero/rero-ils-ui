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
import { Component, inject, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { IllRequestsService } from '../../../service/ill-requests.service';

@Component({
  selector: 'admin-ill-request-detail-view',
  templateUrl: './ill-request-detail-view.component.html'
})
export class IllRequestDetailViewComponent implements DetailRecord, OnInit {

  private recordService: RecordService = inject(RecordService);
  private illRequestService: IllRequestsService = inject(IllRequestsService);

  // COMPONENT ATTRIBUTES =======================================================
  /** The observable resolving record data */
  record$: Observable<any>;
  /** The resource type */
  type: string;
  /** The record */
  record: any;

  /** the requester of the ILL request */
  requester = null;

  /** OnInit hook */
  ngOnInit(): void {
    this.record$.subscribe((record) => {
      this.record = record;
      this.recordService.getRecord('patrons', this.record.metadata.patron.pid).subscribe(
        (patron) => this.requester = patron.metadata
      );
    });
  }

  // FUNCTIONS =================================================================
  /** get the bootstrap color to apply on the request status badge */
  badgeColor(status: string): string {
    return this.illRequestService.badgeColor(status);
  }

}
