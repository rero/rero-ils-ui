/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map, mergeMap } from 'rxjs/operators';
import { Item } from '@app/admin/classes/items';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';

@Component({
  selector: 'admin-overdue-transaction-detail',
  templateUrl: './overdue-transaction-detail.component.html'
})
export class OverdueTransactionDetailComponent implements OnInit {

  /** Patron transaction */
  @Input() transaction: PatronTransaction;
  /** item linked to this transaction if transaction linked to a loan */
  item: Item;

  /**
   * constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /** Load item informations if the transaction is linked to a loan */
  ngOnInit(): void {
    if (this.transaction && this.transaction.loan && this.transaction.loan.pid) {
      this._recordService.getRecord('loans', this.transaction.loan.pid).pipe(
        map(data => data.metadata),
        mergeMap( data => this._recordService.getRecord('items', data.item_pid.value)),
        map(data => new Item(data.metadata))
      ).subscribe((data) => this.item = data);
    }
  }
}
