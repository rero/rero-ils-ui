import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map, mergeMap } from 'rxjs/operators';
import { Item } from 'projects/admin/src/app/classes/items';
import { PatronTransaction } from 'projects/admin/src/app/circulation/classes/patron-transaction';

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
