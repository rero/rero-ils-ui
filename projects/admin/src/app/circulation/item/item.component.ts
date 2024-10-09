/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { Organisation } from '@app/admin/classes/core';
import { Item, ItemAction, ItemNote, ItemNoteType } from '@app/admin/classes/items';
import { Loan, LoanState } from '@app/admin/classes/loans';
import { ItemsService } from '@app/admin/service/items.service';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { RecordService } from '@rero/ng-core';
import { ItemStatus, PermissionsService, UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-item',
  templateUrl: './item.component.html',
  styleUrls: ['../circulation.scss']
})
export class ItemComponent implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private itemService: ItemsService = inject(ItemsService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private userService: UserService = inject(UserService);

  NOTEAPI =  ItemNoteType.API;

  // COMPONENT ATTRIBUTES ====================================================
  /** Current item */
  @Input() item: any;
  /** Current patron */
  @Input() patron: any;
  /** Is the component is collapsed or not */
  @Input() isCollapsed = true;
  /** Item has fees */
  @Output() hasFeesEmitter = new EventEmitter<boolean>();
  /** Extend loan event emitter */
  @Output() extendLoanClicked = new EventEmitter<any[]>();

  /** loan corresponding to the item */
  loan: Loan;
  /** Fees related to the item/loan */
  totalAmountOfFee = 0;
  /** Notifications related to the current loan */
  notifications$: Observable<any>;
  /** ItemAction reference */
  itemAction = ItemAction;
  /** related document */
  document = undefined;
  /** ItemStatus class reference */
  ItemStatus = ItemStatus;
  /** debug mode is enabled ? */
  debugMode = false;

  // GETTER & SETTER =========================================================
  /**
   * Get current organisation
   * @returns current organisation
   */
  get organisation(): Organisation {
    return this.organisationService.organisation;
  }

  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this.permissionsService.canAccessDebugMode();
  }

  /** OnInit hook */
  ngOnInit() {
    this.loan = (this.item && this.item.loan) ? new Loan(this.item.loan) : null;
    if (this.loan) {
      const loanPid = this.item.loan.pid;
      this.patronTransactionService.patronTransactionsByLoan$(loanPid, 'overdue', 'open').subscribe(
        (transactions) => {
          this.totalAmountOfFee = this.patronTransactionService.computeTotalTransactionsAmount(transactions);
          if (this.totalAmountOfFee > 0) {
            this.hasFeesEmitter.emit(true);
          }
        }
      );
      this.notifications$ = this.recordService.getRecords(
        'notifications', `context.loan.pid:${loanPid}`, 1, RecordService.MAX_REST_RESULTS_SIZE,
        [], {}, null, 'mostrecent'
      ).pipe(
        map((results: any) => results.hits.hits)
      );
    }
    if (this.item?.document?.pid) {
      this.recordService.getRecord('documents', this.item.document.pid, 1, {
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
   * Get a note related to the item for the itemAction done or only item.
   * @return the corresponding note if the corresponding action has been done.
   */
  getCirculationNoteForAction(): ItemNote[] {
    if (this.item.actionDone) {
      const checkinNote = this.item.getNote(ItemNoteType.CHECKIN)
      if (checkinNote && (
        (this.item.actionDone === this.itemAction.checkin) || (
          (((this.item.actionDone === this.itemAction.receive) && this.item.library.pid === this.userService.user.currentLibrary))
        )
      )) {
        return [checkinNote];
      }
      const checkoutNote = this.item.getNote(ItemNoteType.CHECKOUT)
      if (checkoutNote && this.item.actionDone === this.itemAction.checkout) {
        return [checkoutNote];
      }
    } else if (this.item.notes) {
      // Notes for item without loan.
      // This api note is pushed on error exception.
      return this.item?.notes.filter(i => [ItemNoteType.CHECKIN, ItemNoteType.API].includes(i.type));
    }
    return [];
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
   * @param item: the item to analyze
   * @param type: the callout type (error, warning, info, ...)
   */
  needCallout(item: Item, type?: string): boolean {
    return this.itemService.needCallout(item, type);
  }
}
