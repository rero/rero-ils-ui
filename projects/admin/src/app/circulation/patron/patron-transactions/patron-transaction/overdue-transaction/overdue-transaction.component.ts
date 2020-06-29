import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map, mergeMap } from 'rxjs/operators';
import { Item } from '../../../../../class/items';
import { PatronTransaction } from '../../../../patron-transaction';

@Component({
  selector: 'admin-overdue-transaction',
  templateUrl: './overdue-transaction.component.html'
})
export class OverdueTransactionComponent implements OnInit {

  /** Patron transaction */
  @Input() transaction: PatronTransaction;

  /** item linked to this transaction if transaction linked to a loan */
  item: Item;

  constructor(
    private _recordService: RecordService
  ) { }

  /** Load item informations if the transaction is linked to a loan */
  ngOnInit(): void {
    if (this.transaction && this.transaction.loan && this.transaction.loan.pid) {
      this._recordService.getRecord('loans', this.transaction.pid).pipe(
        map(data => data.metadata),
        mergeMap( data => this._recordService.getRecord('items', data.item_pid.value)),
        map(data => new Item(data.metadata))
      ).subscribe((data) => this.item = data);
    }
  }
}
