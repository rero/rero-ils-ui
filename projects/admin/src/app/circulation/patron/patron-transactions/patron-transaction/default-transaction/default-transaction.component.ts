import { Component, Input } from '@angular/core';
import { PatronTransaction } from '../../../../patron-transaction';

@Component({
  selector: 'admin-default-transaction',
  templateUrl: './default-transaction.component.html'
})
export class DefaultTransactionComponent {

  /** Patron transaction */
  @Input() transaction: PatronTransaction;

}
