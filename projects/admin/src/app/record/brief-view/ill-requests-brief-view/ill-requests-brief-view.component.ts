/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
 * Copyright (C) 2020-2023 UCLouvain
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
import { RecordService, ResultItem } from '@rero/ng-core';
import { ILLRequestStatus } from '../../../classes/ill-request';

@Component({
  selector: 'admin-ill-requests-brief-view',
  templateUrl: './ill-requests-brief-view.component.html'
})
export class IllRequestsBriefViewComponent  implements ResultItem, OnInit {

  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Record */
  @Input() record: any;
  /** Type of record */
  @Input() type: string;
  /** Detail Url */
  @Input() detailUrl: { link: string, external: boolean };

  /** the requester of the ILL request */
  requester = null;

  // GETTER FUNCTIONS ==========================================================
  /** get the bootstrap color to apply on the request status badge */
  get badgeColor(): string {
    if (this.record) {
      switch (this.record.metadata.status) {
        case ILLRequestStatus.PENDING: return 'warning';
        case ILLRequestStatus.VALIDATED: return 'success';
        case ILLRequestStatus.DENIED: return 'danger';
        default: return 'secondary';
      }
    }
    return 'secondary';
  }

  /** Init hook */
  ngOnInit() {
    if (this.record) {
      this.recordService.getRecord('patrons', this.record.metadata.patron.pid).subscribe(
        (patron) => this.requester = patron.metadata
      );
    }
  }

}
