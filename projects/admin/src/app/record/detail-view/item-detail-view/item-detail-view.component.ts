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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { IssueItemStatus } from '@rero/shared';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Item, ItemNote } from '../../../classes/items';
import { HoldingsService } from '../../../service/holdings.service';
import { OperationLogsService } from '../../../service/operation-logs.service';

@Component({
  selector: 'admin-item-detail-view',
  templateUrl: './item-detail-view.component.html',
  styles: []
})
export class ItemDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Resource type */
  type: string;

  /** Document record */
  record: any;

  /** Location record */
  location: any;


  /** Load operation logs on show */
  showOperationLogs = false;

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this._operationLogsService.isLogVisible('items');
  }

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _holdingService - HoldingsService
   * @param _operationLogsService - OperationLogsService
   */
  constructor(
    private _recordService: RecordService,
    private _holdingService: HoldingsService,
    private _operationLogsService: OperationLogsService
  ) {}

  ngOnInit() {
    this._recordObs = this.record$.subscribe(record => {
      this.record = record;
      this._recordService.getRecord('locations', record.metadata.location.pid, 1).subscribe(data => this.location = data);
    });
  }

  ngOnDestroy() {
    this._recordObs.unsubscribe();
  }

  isPublicNote(note: ItemNote): boolean {
    return Item.PUBLIC_NOTE_TYPES.includes(note.type);
  }

  hasTemporaryItemType(): boolean {
    if ('temporary_item_type' in this.record.metadata) {
      const endDateValue = this.record.metadata.temporary_item_type.end_date || undefined;
      return !(endDateValue && moment(endDateValue).isBefore(moment()));
    }
    return false;
  }

  /**
   * Update item status
   */
  updateItemStatus() {
    this._recordService.getRecord('items', this.record.metadata.pid).subscribe((item: any) => {
      this.record.metadata.status = item.metadata.status;
      this.record.metadata.available = item.metadata.available;
    });
  }

  /**
   * Make the method getIcon available here
   */
  getIcon(status: IssueItemStatus): string {
    return this._holdingService.getIcon(status);
  }

}
