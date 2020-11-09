/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { PatronService } from '../../../../service/patron.service';

@Component({
  selector: 'admin-pickup-item',
  templateUrl: './pickup-item.component.html'
})
export class PickupItemComponent implements OnInit {

  /** Loan */
  @Input() loan = undefined;

  /** Item, document */
  item = undefined;
  document = undefined;

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _patronService - PatronService
   */
  constructor(
    private _recordService: RecordService,
    private _patronService: PatronService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    if (this.loan) {
      const item$ = this._recordService.getRecord('items', this.loan.metadata.item_pid.value, 1);
      const document$ = this._recordService.getRecord('documents', this.loan.metadata.document_pid, 1, {
        Accept: 'application/rero+json, application/json'
      });
      forkJoin([item$, document$]).subscribe(
        ([itemData, documentData]) => {
          this.item = itemData.metadata;
          this.document = documentData.metadata;
        }
      );
    }
  }
}
