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
import { ItemsService } from 'projects/admin/src/app/service/items.service';
import { RecordPermission, RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';


@Component({
  selector: 'admin-document-holding',
  templateUrl: './holding.component.html'
})
export class HoldingComponent implements OnInit, OnDestroy {
  /** Holding record */
  @Input() holding: any;

  /** Document harvested */
  @Input() holdingType: 'electronic' | 'serial' | 'standard';

  /** Items */
  items: any = null;

  /** Items observable reference */
  itemsRef: any;

  /** Items collapsed */
  isItemsCollapsed = false;

  /** Event for delete Holding */
  @Output() deleteHolding = new EventEmitter();

  /** Holding permissions */
  permissions: RecordPermission;

  /** total number of items for this holding */
  totalItemsCounter = 0;

  /** number of item to load/display */
  displayItemsCounter = 5;

  /**
   * constructor
   * @param _recordUiService - RecordUiService
   * @param _recordService - RecordService
   * @param _recordPermissionService - RecordPermissionService
   * @param _translateService - TranslateService
   * @param _holdingService - HoldingsService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordService: RecordService,
    private _recordPermissionService: RecordPermissionService,
    private _translateService: TranslateService,
    private _itemService: ItemsService
  ) { }

  /** Init */
  ngOnInit() {
    if (this.holdingType !== 'electronic') {
      this._loadItems();
    }
    this.getPermissions();
  }

  /** Destroy */
  ngOnDestroy() {
    if (this.itemsRef != null) {
      this.itemsRef.unsubscribe();
    }
  }

  /**
   * Reload items when they are displayed.
   */
  toggleCollapse() {
    if (this.isItemsCollapsed) {
      this._loadItems();
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  /** Remove an item given the item PID.
   *
   * @param itemPid - the PID of the item to remove.
   */
  deleteItem(itemPid) {
    this._recordUiService.deleteRecord('items', itemPid).subscribe((success: any) => {
      if (success) {
        this.items = this.items.filter((i: any) => itemPid !== i.metadata.pid);
        if (this.items.length === 0) {
          this.deleteHolding.emit({holding: this.holding, callBackend: false});
        }
      }
    });
  }

  /** Get permissions */
  getPermissions() {
    this._recordPermissionService
      .getPermission('holdings', this.holding.metadata.pid)
      .subscribe(permissions => this.permissions = permissions);
  }

  /**
   * Delete the holding.
   */
  delete() {
    this.deleteHolding.emit({holding: this.holding});
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
   * Load the items corresponding to a given holding PID.
   */
  private _loadItems() {
    let query = `holding.pid:${this.holding.metadata.pid}`;
    let sort = '';
    if (this.holding.metadata.holdings_type === 'serial') {
      query += ' AND -issue.status:(claimed OR deleted)';
      sort = '-issue_expected_date';
    }
    this.itemsRef = this._recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, null, sort)
      .subscribe(result => {
        this.items = (result.hits.total > 0) ? result.hits.hits : null;
        this.totalItemsCounter = result.hits.total;
      });
  }

  /**
   * Load more items
   * @param increment : number of items to add into the item list
   */
  showMore(increment = 5) {
    this.displayItemsCounter += increment;
  }

  /**
   * Get the counter string about not loaded items
   * @return the string to display with the 'show more' link
   */
  showMoreItemsCounter(itemType: string, pluralForm?: string) {
    const plural = (pluralForm == null) ? itemType + 's' : pluralForm;
    const additionalIssueCounter = this.totalItemsCounter - this.displayItemsCounter;
    itemType = (additionalIssueCounter > 1) ? plural : itemType;
    return additionalIssueCounter + ' ' + this._translateService.instant('hidden') + ' ' + itemType;
  }
}
