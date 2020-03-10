import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { User } from '../../../class/user';
import { OrganisationService } from '../../../service/organisation.service';
import { PatronService } from '../../../service/patron.service';
import { PatronTransaction, PatronTransactionStatus } from '../../patron-transaction';
import { PatronTransactionService } from '../../patron-transaction.service';
import { PatronTransactionEventFormComponent } from './patron-transaction-event-form/patron-transaction-event-form.component';

@Component({
  selector: 'admin-patron-transactions',
  templateUrl: './patron-transactions.component.html'
})
export class PatronTransactionsComponent implements OnInit, OnDestroy {

  /** PatronTransactions to display */
  transactions: Array<PatronTransaction> = [];
  historyTransactions: Array<PatronTransaction> = [];

  /** Subscription to PatronTransaction.service.ts --> patronTransactionByPatronSubject */
  patronTransactionSubscription$: Subscription;
  /** Total amount of PatronTransactions array */
  transactionsTotalAmount = 0;
  /** Current patron */
  private _patron: User = undefined;
  /** Is user has requested all the patron transactions history */
  isHistoryCollapsed = true;
  /** boolean to know if we need to display a spinner */
  isLoading = true;
  historyIsLoading = true;



  constructor(
    private _patronService: PatronService,
    private _organisationService: OrganisationService,
    private _patronTransactionService: PatronTransactionService,
    private _modalService: BsModalService
  ) {}


  ngOnInit() {
    this._patronService.currentPatron$.subscribe(patron => {
      if (patron) {
        this._patron = patron;
        this.patronTransactionSubscription$ = this._patronTransactionService.patronTransactionsSubject$.subscribe(
          (transactions) => {
            this.transactions = transactions;
            this.transactionsTotalAmount = this._patronTransactionService.computeTotalTransactionsAmount(transactions);
          }
        );
        this._patronTransactionService.emitPatronTransactionByPatron(patron.pid, undefined, 'open');
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.patronTransactionSubscription$) {
      this.patronTransactionSubscription$.unsubscribe();
    }
  }

  /** load all PatronTransactions for the patron without 'status' restriction */
  public toggleFeesHistory() {
    if (this.isHistoryCollapsed) {
      if (this._patron) {
        if (this.historyTransactions.length > 0) {
          this.isHistoryCollapsed = false;
        } else {
          this.historyIsLoading = true;
          this._patronTransactionService.patronTransactionsByPatron$(
            this._patron.pid,
            undefined,
            PatronTransactionStatus.CLOSED.toString()
          ).subscribe(
            (transactions) => {
              this.historyTransactions = transactions;
              this.historyIsLoading = false;
              this.isHistoryCollapsed = false;
            }
          );
        }
      }
    } else {
      this.isHistoryCollapsed = true;
    }
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }


  /** Allow to pay the total of each pending patron transactions */
  public payAllTransactions() {
    const initialState = {
      action: 'pay',
      mode: 'full',
      transactions: this.transactions
    };
    this._modalService.show(PatronTransactionEventFormComponent, {initialState});
  }

}
