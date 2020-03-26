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

import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import {
  RecordPermissionService,
  RecordPermission
} from 'projects/admin/src/app/service/record-permission.service';


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
  items: any;

  /** Items observable reference */
  itemsRef: any;

  /** Items collapsed */
  isItemsCollapsed = false;

  /** Event for delete Holding */
  @Output() deleteHolding = new EventEmitter();

  /** Holding permissions */
  permissions: RecordPermission;

  constructor(
    private _recordUiService: RecordUiService,
    private _recordService: RecordService,
    private _recordPermissionService: RecordPermissionService
  ) { }

  /** Init */
  ngOnInit() {
    if (this.holdingType === 'standard') {
      this._loadItems(this.holding.metadata.pid);
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
      this._loadItems(this.holding.metadata.pid);
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  /** Remove an item given the item PID.
   *
   * @param itemPid - the PID of the item to remove.
   */
  deleteItem(item) {
    this._recordUiService.deleteRecord('items', item.metadata.pid).subscribe((success: any) => {
      if (success) {
        this.items = this.items.filter(
          (i: any) => item.metadata.pid !== i.metadata.pid
        );
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
   * @param item - Item record
   */
  get deleteInfoMessage() {
    const message = this._recordPermissionService.generateDeleteMessage(
      this.permissions.delete.reasons
    );
    return message;
  }

  /**
   * Load the items corresponding to a given holding PID.
   * @param holdingPid - PID of the holding
   */
  private _loadItems(holdingPid: string) {
    const query = `holding.pid:${holdingPid}`;
    this.items = [];
    this.itemsRef = this._recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .subscribe(result => {
        if (result.hits.total > 0) {
          this.items = result.hits.hits;
        }
      });
  }
}
