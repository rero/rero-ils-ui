import { Component, Input } from '@angular/core';
import { PatronTransaction } from '../../../../../classes/patron-transaction';

@Component({
  selector: 'admin-default-transaction-detail',
  templateUrl: './default-transaction-detail.component.html'
})
export class DefaultTransactionDetailComponent {

  /** Patron transaction */
  @Input() transaction: PatronTransaction;

}
