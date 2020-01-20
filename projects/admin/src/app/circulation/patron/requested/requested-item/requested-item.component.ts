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
import { Component, OnInit, Input } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { PatronService } from 'projects/admin/src/app/service/patron.service';

@Component({
  selector: 'admin-requested-item',
  templateUrl: './requested-item.component.html'
})
export class RequestedItemComponent implements OnInit {

  /**
   * Loan
   */
  @Input() loan = undefined;

  /**
   * Item
   */
  item = undefined;

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
      this._recordService.getRecord('items', this.loan.metadata.item_pid)
      .subscribe(result => {
        this._patronService.getItem(result.metadata.barcode).subscribe(
          item => this.item = item
        );
      });
    }
  }
}
