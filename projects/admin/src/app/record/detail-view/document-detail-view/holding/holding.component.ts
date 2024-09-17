/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HoldingsService } from '@app/admin/service/holdings.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { UserService } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { ItemRequestComponent } from '../item-request/item-request.component';

@Component({
  selector: 'admin-document-holding',
  templateUrl: './holding.component.html',
  styles: ['a.collapse-link i { min-width: 16px}']
})
export class HoldingComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding record */
  @Input() holding: any;
  /** Event for delete holding */
  @Output() deleteHolding = new EventEmitter();
  /** Items collapsed */
  @Input() isItemsCollapsed = true;
  /** Restrict the functionality of interface */
  @Input() isCurrentOrganisation = true;

  /** shortcut for holding type */
  holdingType: 'electronic' | 'serial' | 'standard';
  /** Items */
  items: any = null;
  /** Items observable reference */
  itemsRef: any;
  /** Holding permissions */
  permissions: any;
  /** total number of items for this holding */
  totalItemsCounter = 0;
  /** number of item to load/display */
  displayItemsCounter = 10;

  // GETTER & SETTER ==========================================================
  /** Current interface language */
  get language() {
    return this.translateService.currentLang;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param recordUiService - RecordUiService
   * @param recordService - RecordService
   * @param recordPermissionService - RecordPermissionService
   * @param translateService - TranslateService
   * @param userService - UserService
   * @param holdingService: HoldingsService
   */
  constructor(
    private recordUiService: RecordUiService,
    private recordService: RecordService,
    private recordPermissionService: RecordPermissionService,
    private translateService: TranslateService,
    protected userService: UserService,
    protected holdingService: HoldingsService,
  ) { }

  /** onInit hook */
  ngOnInit() {
    this.holdingType = this.holding.metadata.holdings_type;
    if (this.holdingType !== 'electronic') {
      this._loadItems();
    }
    if (this.isCurrentOrganisation) {
      this._getPermissions();
    }
  }

  /** onDestroy hook */
  ngOnDestroy() {
    if (this.itemsRef != null) {
      this.itemsRef.unsubscribe();
    }
  }

  /** Get permissions */
  private _getPermissions(): void {
    const permissionObs = this.recordPermissionService.getPermission('holdings', this.holding.metadata.pid);
    const canRequestObs = this.holdingService.canRequest(this.holding.metadata.pid);
    forkJoin([permissionObs, canRequestObs]).subscribe(
      ([permissions, canRequest]) => {
        this.permissions = this.recordPermissionService
          .membership(
            this.userService.user,
            this.holding.metadata.library.pid,
            permissions
          );
        this.permissions.canRequest = canRequest;
    });
  }

  /**
   * Add request on holding and refresh permissions
   * @param recordPid - string
   */
  addRequest(recordPid: string, recordType: string): void {
    const ref: DynamicDialogRef = this.dialogService.open(ItemRequestComponent, {
      data: { recordPid, recordType }
    });
    ref.onClose.subscribe((value?: boolean) => {
      if (value) {
        this._getPermissions();
        this._loadItems();
      }
    });
  }

  /**
   * Return a message containing the reasons wht the holding cannot be requested
   */
  get cannotRequestInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions.canRequest.reasons, 'request');
  }

  /** Load the items corresponding to a given holding PID. */
  private _loadItems(): void {
    let query = `holding.pid:${this.holding.metadata.pid}`;
    let sort = '';
    switch (this.holding.metadata.holdings_type) {
      case 'serial':
        query += ' AND -issue.status:(claimed OR deleted OR late)';
        sort = '-issue_sort_date';
        break;
      case 'standard':
        sort = 'enumeration_chronology';
        break;
    }
    this.itemsRef = this.recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, {Accept: 'application/rero+json'}, sort)
      .subscribe((result: Record) => {
        this.items = (this.recordService.totalHits(result.hits.total) > 0) ? result.hits.hits : null;
        this.totalItemsCounter = this.recordService.totalHits(result.hits.total);
      });
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Reload items when they are displayed. */
  toggleCollapse(event: Event) {
    event.preventDefault();
    if (this.isItemsCollapsed) {
      this._loadItems();
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  /**
   * Remove an item given the item PID from the current holding. If the item is
   * the last of the holding, delete the holding too.
   * @param itemPid: string - the PID of the item to remove.
   */
  deleteItem(itemPid: string): void {
    this.recordUiService.deleteRecord('items', itemPid).subscribe(
      (success: boolean) => {
        if (success) {
          // Remove the corresponding item from the item list.
          // If after this delete operation, the list if empty, then we could remove the holding BUT
          // we don't need to call the backend because the holding should already be removed
          // by backend.
          this.items = this.items.filter((i: any) => itemPid !== i.metadata.pid);
          if (this.items.length === 0) {
            this.delete(false);
          }
        }
      }
    );
  }

  /**
   * Delete the holding.
   * By default, the HTTP call to delete the holdings doesn't
   * need to be called because the backend do this job if an holding doesn't have
   * any related item. But it's only the case for standard holding.
   * For other holding type, the backend could be call the physically delete the holding
   * (only if not items are linked to the holding)
   * @param callBackend: boolean - is backend should be called.
   */
  delete(callBackend?: boolean) {
    const params: any = { holding: this.holding };
    if (callBackend !== undefined) {
      params.callBackend = callBackend;
    }
    this.deleteHolding.emit(params);
  }

  /**
   * Display message if the record cannot be deleted
   * @return the delete info message use hover the delete button
   */
  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateDeleteMessage(
      this.permissions.delete.reasons
    );
  }

  /**
   * Load more items
   * @param increment : number of items to add into the item list
   */
  showMore(increment: number = 5) {
    this.displayItemsCounter += increment;
  }

  /**
   * Get the counter string about not loaded items
   * @param itemType: the type of item related to the counter
   * @return the string to display with the 'show more' link
   */
  showMoreItemsCounter(itemType: string) {
    const messages = {
      issue: {
        singular: '{{ counter }} hidden issue',
        plural: '{{ counter }} hidden issues'
      },
      default: {
        singular: '{{ counter }} hidden item',
        plural: '{{ counter }} hidden items'
      }
    };
    const message = messages.hasOwnProperty(itemType) ? messages[itemType] : messages.default;
    const additionalItemCounter = this.totalItemsCounter - this.displayItemsCounter;
    return this.translateService.instant(
      (additionalItemCounter === 1) ? message.singular : message.plural,
      {counter: additionalItemCounter}
    );
  }
}
