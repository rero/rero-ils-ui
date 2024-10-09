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

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { LoanState } from '@app/admin/classes/loans';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-requested-item',
  templateUrl: './requested-item.component.html',
  styleUrls: ['./requested-item.component.scss']
})
export class RequestedItemComponent implements OnInit {

  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES ====================================================

  // Input/Output attributes
  /** requested item */
  @Input() item: any;
  /** Is the detail should be collapsed */
  @Input() isCollapsed: boolean;
  /** the callout css class to use for this item */
  @Input() callout: string = null;
  /** Event emit when a request is validate */
  @Output() requestValidated = new EventEmitter();

  // Class attributes
  /** document related to the item */
  document;
  /** reference to LoanState class :: To use LoanState into template */
  LoanState = LoanState;

  /** OnInit hook */
  ngOnInit() {
    if (this.item) {
      this.recordService.getRecord('documents', this.item.loan.document_pid, 1, {
        Accept: 'application/rero+json, application/json'
      }).subscribe(document => this.document = document.metadata);
    }
  }

  // COMPONENT FUNCTIONS ====================================================
  /** Validate a request */
  validateRequest() {
    this.requestValidated.emit(this.item.barcode);
  }

  /** Get the callout css code if needed.
   *  The callout css is used to highlight a request for a particular reason (new request, validated request, ...)
   */
  getCallout() {
    return (this.callout !== null)
      ? `callout ${this.callout}`
      : 'border rounded';
  }

}
