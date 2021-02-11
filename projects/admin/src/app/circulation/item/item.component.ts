/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, ItemAction, ItemNote, ItemNoteType, ItemStatus} from 'projects/admin/src/app/classes/items';
import { Loan, LoanState } from 'projects/admin/src/app/classes/loans';
import { ItemsService } from 'projects/admin/src/app/service/items.service';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { PatronTransactionService } from '../services/patron-transaction.service';

@Component({
  selector: 'admin-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  // COMPONENT ATTRIBUTES ====================================================
  /** Current item */
  @Input() item: any;
  /** Current patron */
  @Input() patron: any;
  /** Item has fees */
  @Output() hasFeesEmitter = new EventEmitter<boolean>();
  /** Extend loan event emitter */
  @Output() extendLoanClicked = new EventEmitter<any[]>();

  /** loan corresponding to the item */
  loan: Loan;
  /** Is collapsed */
  isCollapsed = true;
  /** Total amount of fee */
  totalAmountOfFee = 0;
  /** Notifications related to the current loan */
  notifications$: Observable<any>;
  /** ItemAction reference */
  itemAction = ItemAction;
  /** related document */
  document = undefined;
  /** ItemStatus class reference */
  ItemStatus = ItemStatus;

  // GETTER & SETTER =========================================================
  /**
   * Get current organisation
   * @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }


  // CONSTRUCTOR & HOOKS ====================================================
  /**
   * Constructor
   * @param _recordService: Record Service
   * @param _organisationService: Organisation Service
   * @param _patronTransactionService: Patron transaction Service
   * @param _itemService: Item Service
   */
  constructor(
    private _recordService: RecordService,
    private _organisationService: OrganisationService,
    private _patronTransactionService: PatronTransactionService,
    private _itemService: ItemsService
  ) {  }

  /** OnInit hook */
  ngOnInit() {
    this.loan = (this.item && this.item.loan) ? new Loan(this.item.loan) : null;
    if (this.loan) {
      const loanPid = this.item.loan.pid;
      this._patronTransactionService.patronTransactionsByLoan$(loanPid, 'overdue', 'open').subscribe(
        (transactions) => {
          this.totalAmountOfFee = this._patronTransactionService.computeTotalTransactionsAmount(transactions);
          if (this.totalAmountOfFee > 0) {
            this.hasFeesEmitter.emit(true);
          }
        }
      );
      this.notifications$ = this._recordService.getRecords(
        'notifications',
        `loan.pid:${loanPid}`,
        1,
        RecordService.MAX_REST_RESULTS_SIZE,
        [],
        {},
        null,
        'mostrecent'
      ).pipe(
        map((results: any) => results.hits.hits)
      );
      this._recordService.getRecord('documents', this.item.document.pid, 1, {
        Accept: 'application/rero+json, application/json'
      }).subscribe(document => this.document = document.metadata);
    }
  }

  // COMPONENT FUNCTIONS ====================================================
  /**
   * Get transit location pid
   * @return: transit location pid
   */
  getTransitLocationPid() {
    if (this.patron || this.item.action_applied === undefined) {
      if (this.item.loan && this.item.loan.state === LoanState.ITEM_IN_TRANSIT_FOR_PICKUP) {
        return this.item.loan.pickup_location_pid;
      }
      if (this.item.loan && this.item.loan.state === LoanState.ITEM_IN_TRANSIT_TO_HOUSE) {
        return this.item.location.pid;
      }
    } else {
      const validatedLoan = new Loan(this.item.action_applied[ItemAction.validate]);
      const checkedInLoan = new Loan(this.item.action_applied[ItemAction.checkin]);
      if (validatedLoan && validatedLoan.state === LoanState.ITEM_IN_TRANSIT_FOR_PICKUP) {
        return validatedLoan.pickup_location_pid;
      }
      if (checkedInLoan && checkedInLoan.state === LoanState.ITEM_IN_TRANSIT_TO_HOUSE) {
        return this.item.location.pid;
      }
    }
    return null;
  }

  /**
   * Get a note related to the item for the itemAction done.
   * @return the corresponding note if the corresponding action has been done.
   */
  getCirculationNoteForAction(): ItemNote|null {
    if (this.item.actionDone) {
      if (this.item.actionDone === this.itemAction.checkin) {
        return this.item.getNote(ItemNoteType.CHECKIN);
      }
      if (this.item.actionDone === this.itemAction.checkout) {
        return this.item.getNote(ItemNoteType.CHECKOUT);
      }
    }
    return null;
  }

  /**
   * Extend loan action
   * @param event: the event fired
   */
  extendLoanClick(event: any) {
    this.extendLoanClicked.emit(this.item);
  }


  /**
   * Is a callout wrapper is required for this item.
   * @param item: the item to analyse
   * @param type: the callout type (error, warning, info, ...)
   */
  needCallout(item: Item, type?: string): boolean {
    return this._itemService.needCallout(item, type);
  }
}
