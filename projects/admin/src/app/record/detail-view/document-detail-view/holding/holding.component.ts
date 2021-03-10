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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { RecordPermission, RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';


@Component({
  selector: 'admin-document-holding',
  templateUrl: './holding.component.html'
})
export class HoldingComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding record */
  @Input() holding: any;
  /** Event for delete holding */
  @Output() deleteHolding = new EventEmitter();

  /** shortcut for holding type */
  holdingType: 'electronic' | 'serial' | 'standard';
  /** Items */
  items: any = null;
  /** Items observable reference */
  itemsRef: any;
  /** Items collapsed */
  isItemsCollapsed = false;
  /** Holding permissions */
  permissions: RecordPermission;
  /** total number of items for this holding */
  totalItemsCounter = 0;
  /** number of item to load/display */
  displayItemsCounter = 5;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * constructor
   * @param _recordUiService - RecordUiService
   * @param _recordService - RecordService
   * @param _recordPermissionService - RecordPermissionService
   * @param _translateService - TranslateService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordService: RecordService,
    private _recordPermissionService: RecordPermissionService,
    private _translateService: TranslateService,
  ) { }

  /** onInit hook */
  ngOnInit() {
    this.holdingType = this.holding.metadata.holdings_type;
    if (this.holdingType !== 'electronic') {
      this._loadItems();
    }
    this._getPermissions();
  }

  /** onDestroy hook */
  ngOnDestroy() {
    if (this.itemsRef != null) {
      this.itemsRef.unsubscribe();
    }
  }

  /** Get permissions */
  private _getPermissions(): void {
    this._recordPermissionService
      .getPermission('holdings', this.holding.metadata.pid)
      .subscribe(permissions => this.permissions = permissions);
  }

  /** Load the items corresponding to a given holding PID. */
  private _loadItems(): void {
    let query = `holding.pid:${this.holding.metadata.pid}`;
    let sort = '';
    if (this.holding.metadata.holdings_type === 'serial') {
      query += ' AND -issue.status:(claimed OR deleted OR late)';
      sort = '-issue_expected_date';
    }
    this.itemsRef = this._recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, null, sort)
      .subscribe((result: Record) => {
        this.items = (this._recordService.totalHits(result.hits.total) > 0) ? result.hits.hits : null;
        this.totalItemsCounter = this._recordService.totalHits(result.hits.total);
      });
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Reload items when they are displayed. */
  toggleCollapse() {
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
    this._recordUiService.deleteRecord('items', itemPid).subscribe(
      (success: boolean) => {
        if (success) {
          this.items = this.items.filter((i: any) => itemPid !== i.metadata.pid);
          if (this.items.length === 0) {
            this.delete(true);
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
    return this._recordPermissionService.generateDeleteMessage(
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
    return this._translateService.instant(
      (additionalItemCounter === 1) ? message.singular : message.plural,
      {counter: additionalItemCounter}
    );
  }
}
