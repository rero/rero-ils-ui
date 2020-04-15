import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { OrganisationService } from '../../../../service/organisation.service';
import { PatronTransaction, PatronTransactionEventType, PatronTransactionStatus } from '../../../patron-transaction';
import { PatronTransactionService } from '../../../patron-transaction.service';
import {
  PatronTransactionEventFormComponent
} from '../patron-transaction-event-form/patron-transaction-event-form.component';


@Component({
  selector: 'admin-patron-transaction',
  templateUrl: './patron-transaction.component.html'
})
export class PatronTransactionComponent implements OnInit {

  /** Patron transaction */
  @Input() transaction: PatronTransaction;

  /** Is collapsed */
  isCollapsed = true;

  /** reference to PatronTransactionStatus -- used in HTML template */
  public patronTransactionStatus = PatronTransactionStatus;

  constructor(
    private _organisationService: OrganisationService,
    private _patronTransactionService: PatronTransactionService,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    if (this.transaction) {
      this._patronTransactionService.loadTransactionHistory(this.transaction);
    }
  }

  /** get the total amount for a patron transaction :
   *  If transaction is still open, then return the total transaction amount
   *  If transaction is closed, then transaction total amount should be zero. In this case, the transaction will be
   *  displayed into history and for this part, it's better to display the initial/total due instead of
   *  still due amount.
   *  @return: the transaction total amount to display depending of transaction status
   */
  get transactionAmount(): number {
    if (this.transaction.status === PatronTransactionStatus.OPEN) {
      return this.transaction.total_amount;
    } else {
      let amount = 0;
      for (const event of this.transaction.get_events()) {
        if (event.type === PatronTransactionEventType.FEE) {
          amount += event.amount;
        }
      }
      return amount;
    }
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  /** Check if the transaction contains a 'dispute' linked event
   *  @return: True if transaction is still open and contains a 'dispute' event; False otherwise
   */
  public isDisputed() {
    return (this.transaction.status === PatronTransactionStatus.OPEN)
      ? this.transaction.events.some( e => e.type === PatronTransactionEventType.DISPUTE)
      : false;
  }


  /** Load and show details about the transaction */
  public showDetail() {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Execute an action about the transaction using a custom form into a modal window
   * @param action: the action to execute (pay, dispute, resolve)
   * @param model: if action == 'pay', if we pay a part or the total amount of the transaction ('part'|'full')
   */
  patronTransactionAction(action: string, mode?: string) {
    const initialState = {
      action,
      mode,
      transactions: [this.transaction]
    };
    this._modalService.show(PatronTransactionEventFormComponent, {initialState});
  }
}
