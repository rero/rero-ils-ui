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

import { Component, effect, inject, input, model, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransactionService } from '@app/admin/circulation/services/patron-transaction.service';
import { Organisation } from '@app/admin/classes/core';
import { Item, ItemAction, ItemNote, ItemNoteType } from '@app/admin/classes/items';
import { Loan, LoanState } from '@app/admin/classes/loans';
import { ItemsService } from '@app/admin/service/items.service';
import { RecordService, DateTranslatePipe, GetRecordPipe, TruncateTextPipe } from '@rero/ng-core';
import { AppStore, ItemStatus, OpenCloseButtonComponent, InheritedCallNumberComponent, ContributionComponent, IdAttributePipe, MainTitlePipe } from '@rero/shared';
import { map } from 'rxjs/operators';
import { CirculationStore } from '../store/circulation.store';
import { computeTotalTransactionsAmount } from '../utils/transaction.utils';
import { NgClass, AsyncPipe, JsonPipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { ButtonDirective, Button } from 'primeng/button';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ScrollPanel } from 'primeng/scrollpanel';
import { GetLoanCipoPipe } from '../pipe/get-loan-cipo.pipe';

@Component({
    selector: 'admin-item',
    templateUrl: './item.component.html',
    imports: [NgClass, OpenCloseButtonComponent, RouterLink, InheritedCallNumberComponent, Bind, Tag, ContributionComponent, ButtonDirective, TranslateDirective, Button, ScrollPanel, AsyncPipe, JsonPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, IdAttributePipe, MainTitlePipe, TruncateTextPipe, TranslatePipe, GetLoanCipoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {

  private recordService: RecordService = inject(RecordService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private itemService: ItemsService = inject(ItemsService);
  private appStore = inject(AppStore);
  protected store = inject(CirculationStore);


  NOTEAPI =  ItemNoteType.API;

  // COMPONENT ATTRIBUTES ====================================================
  /** Current item */
  item = input<any>();
  /** Current patron */
  patron = input<any>();
  /** Is the component is collapsed or not */
  isCollapsed = model(true);
  /** Item has fees */
  hasFeesEmitter = output<boolean>();
  /** Extend loan event emitter */
  extendLoanClicked = output<any[]>();

  readonly loan = signal<Loan | null>(null);
  readonly totalAmountOfFee = signal(0);
  readonly notifications = signal<any[] | null>(null);
  readonly itemAction = ItemAction;
  readonly document = signal<any>(undefined);
  readonly ItemStatus = ItemStatus;
  readonly debugMode = signal(false);

  // GETTER & SETTER =========================================================
  /**
   * Get current organisation
   * @returns current organisation
   */
  get organisation(): Organisation {
    return this.appStore.organisation();
  }

  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this.appStore.canAccessDebugMode();
  }
  constructor() {
    effect(() => {
      const item = this.item();
      if (item) {
        this.loan.set(item.loan ? new Loan(item.loan) : null);
        this.notifications.set(null);
        if (this.loan()) {
          const loanPid = item.loan.pid;
          this.patronTransactionService.patronTransactionsByLoan(loanPid, 'overdue', 'open').subscribe(
            (transactions) => {
              const amount = computeTotalTransactionsAmount(transactions);
              this.totalAmountOfFee.set(amount);
              if (amount > 0) {
                this.hasFeesEmitter.emit(true);
                if (this.patron().pid) {
                  this.store.loadFees(this.patron().pid);
                }
              }
            }
          );
          this.recordService.getRecords(
            'notifications', { query: `context.loan.pid:${loanPid}`, page: 1, itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: 'mostrecent' }
          ).pipe(
            map((results: any) => results.hits.hits)
          ).subscribe((hits: any[]) => this.notifications.set(hits));
        }
        if (item?.document?.pid) {
          this.recordService.getRecord('documents', item.document.pid, {
            resolve: 1,
            headers: { Accept: 'application/rero+json, application/json' }
          }).subscribe(doc => this.document.set(doc.metadata));
        }
      }
    });
  }

  // COMPONENT FUNCTIONS ====================================================
  /**
   * Get transit location pid
   * @return: transit location pid
   */
  getTransitLocationPid() {
    if (this.patron() || this.item().action_applied === undefined) {
      if (this.item().loan && this.item().loan.state === LoanState.ITEM_IN_TRANSIT_FOR_PICKUP) {
        return this.item().loan.pickup_location_pid;
      }
      if (this.item().loan && this.item().loan.state === LoanState.ITEM_IN_TRANSIT_TO_HOUSE) {
        return this.item().location.pid;
      }
    } else {
      const validatedLoan = new Loan(this.item().action_applied[ItemAction.validate]);
      const checkedInLoan = new Loan(this.item().action_applied[ItemAction.checkin]);
      if (validatedLoan && validatedLoan.state === LoanState.ITEM_IN_TRANSIT_FOR_PICKUP) {
        return validatedLoan.pickup_location_pid;
      }
      if (checkedInLoan && checkedInLoan.state === LoanState.ITEM_IN_TRANSIT_TO_HOUSE) {
        return this.item().location.pid;
      }
    }
    return null;
  }

  /**
   * Get a note related to the item for the itemAction done or only item.
   * @return the corresponding note if the corresponding action has been done.
   */
  getCirculationNoteForAction(): ItemNote[] {
    if (this.item().actionDone) {
      const notes: ItemNote[] = [];
      const checkinNote = this.item().getNote(ItemNoteType.CHECKIN)
      if (checkinNote && (
        (this.item().actionDone === this.itemAction.checkin) || (
          (((this.item().actionDone === this.itemAction.receive) && this.item().library.pid === this.appStore.currentLibraryPid()))
        )
      )) {
        notes.push(checkinNote);
      }
      const checkoutNote = this.item().getNote(ItemNoteType.CHECKOUT)
      if (checkoutNote && this.item().actionDone === this.itemAction.checkout) {
        notes.push(checkoutNote);
      }
      // Also include API notes (like temporary item type removal)
      const apiNotes = this.item()?.notes?.filter(i => i.type === ItemNoteType.API) || [];
      notes.push(...apiNotes);
      return notes;
    } else if (this.item().notes) {
      // Notes for item without loan.
      // This api note is pushed on error exception.
      return this.item()?.notes.filter(i => [ItemNoteType.CHECKIN, ItemNoteType.API].includes(i.type));
    }
    return [];
  }

  /**
   * Extend loan action
   * @param event: the event fired
   */
  extendLoanClick(_event: any) {
    this.extendLoanClicked.emit(this.item());
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
